import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Course {
  id: number;
  lecid: string;
  name: string;
  credits: number;
  category: string;
  grade: number;      // 학년
  semester: number;
  isAdded?: boolean;
  score: string;      // A+, A0 ...
  isUpdated?: boolean; // 수정 완료 여부
}

const ITEMS_PER_PAGE = 10;   // 조회 결과용
const MY_ITEMS_PER_PAGE = 5; // 내 수강 과목용

const getScoreValue = (score: string): number => {
  const scoreMap: { [key: string]: number } = {
    'A+': 4.3, 'A0': 4.0,
    'A-': 3.7, 'B+': 3.3,
    'B0': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C0': 2.0,
    'C-': 1.7, 'D+': 1.3,
    'D0': 1.0, 'D-': 0.7,
    'F': 0.0, 'P': 5.0, 'NP': 0.0,
  };
  return scoreMap[score] || 0.0;
};

const getPaginationGroup = (currentPage: number, totalPages: number) => {
  const start = Math.floor((currentPage - 1) / 5) * 5 + 1;
  return Array.from(
    { length: Math.min(5, totalPages - start + 1) },
    (_, i) => start + i
  );
};

const SemesterNumberChange = (sem: number) => {
  switch (sem) {
    case 1: return '1';
    case 3: return '2';
    default: return String(sem);
  }
};

const Summary: React.FC = () => {
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);        // 조회 결과용
  const [myPage, setMyPage] = useState(1);                  // 내 수강 과목용
  const [loading, setLoading] = useState(false);            // 조회 버튼 로딩
  const [loadingMyCourses, setLoadingMyCourses] = useState(true); // 내 수강 과목 초기 로딩
  const [updatingCourse, setUpdatingCourse] = useState<string | null>(null); // 수정중인 과목 lecid
  const [deletingCourse, setDeletingCourse] = useState<number | null>(null); // 삭제중인 과목 id
  const [addingCourse, setAddingCourse] = useState<number | null>(null); // 추가중인 과목 id

  // 마운트 시 내 수강 과목 1번만 불러오기
  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        setLoadingMyCourses(true);
        const myCoursesRes = await axios.get('/api/course/history');
        const myFetchedCourses: Course[] = myCoursesRes.data.map(
          (course: any, idx: number) => ({
            id: idx,
            lecid: course.lecid || course.lecId,
            name: course.lectureName || course.name,
            credits: course.credit || course.credits,
            category: course.lecType || course.category,
            grade: course.grade || 0,
            semester: course.semester || 0,
            score: course.received_grade || 'A+',
            isAdded: true,
            isUpdated: false,
          })
        );
        setMyCourses(myFetchedCourses);
      } catch (error) {
        console.error('내 수강 과목 불러오기 실패:', error);
      } finally {
        setLoadingMyCourses(false);
      }
    };
    fetchMyCourses();
  }, []);

  // 내 수강 과목이 바뀌면 검색 결과의 isAdded 동기화
  useEffect(() => {
    setSearchResults(prevResults =>
      prevResults.map(searchItem => {
        const isAdded = myCourses.some(my => my.lecid === searchItem.lecid);
        return { ...searchItem, isAdded };
      })
    );
  }, [myCourses]);

  // 학년 변경
  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGrade = e.target.value;
    setSelectedGrade(newGrade);
    if (newGrade === 'all') setSelectedSemester('all');
  };

  // 조회 버튼 클릭 시 호출
  const handleSearchClick = async () => {
    const hasSearchTerm = searchTerm.trim().length > 0;
    const hasGrade = selectedGrade !== 'all';
    const hasSemester = selectedSemester !== 'all';

    try {
      setLoading(true);
      let response;

      if (hasSearchTerm) {
        response = await axios.get('/api/lecture/list', {
          params: {
            keyword: searchTerm,
            grade: hasGrade ? Number(selectedGrade) : undefined,
            semester: hasSemester ? Number(selectedSemester) : undefined,
          },
        });
      } else if (!hasGrade) {
        response = await axios.get('/api/lecture/list', { params: {} });
      } else if (hasGrade && hasSemester) {
        response = await axios.get('/api/lecture/standard', {
          params: {
            grade: Number(selectedGrade),
            semester: Number(selectedSemester),
          },
        });
      } else {
        response = await axios.get('/api/lecture/list', {
          params: { grade: Number(selectedGrade) },
        });
      }

      const fetchedSearchResults: Course[] = (response.data || []).map(
        (course: any, idx: number) => {
          const alreadyExists = myCourses.some(
            my => my.lecid === (course.lecId || course.lecid)
          );
          return {
            id: idx,
            lecid: course.lecId || course.lecid,
            name: course.lectureName || course.name,
            credits: course.credit || course.credits,
            category: course.lectureType || course.lecType || '전공선택',
            grade: hasGrade ? Number(selectedGrade) : (course.grade || 0),
            semester: hasSemester ? Number(selectedSemester) : (course.semester || 0),
            score: 'A+',
            isAdded: alreadyExists,
          };
        }
      );

      setSearchResults(fetchedSearchResults);
      setCurrentPage(1);
    } catch (error) {
      console.error('데이터 불러오기 실패:', error);
      setSearchResults([]);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  const updateCourseInfo = async (lecId: string, lecType: string, score: string) => {
    const payload = { lecId, lecType, receivedGrade: getScoreValue(score) };
    try {
      setUpdatingCourse(lecId);
      await axios.put('/api/course/update', payload);
      setMyCourses(prev =>
        prev.map(c =>
          c.lecid === lecId ? { ...c, isUpdated: true } : c
        )
      );
    } catch (error) {
      console.error('정보 수정 실패:', error);
    } finally {
      setUpdatingCourse(null);
    }
  };

  const handleMyCourseCategoryChange = (id: number, newCategory: string) => {
    setMyCourses(prev =>
      prev.map(c =>
        c.id === id ? { ...c, category: newCategory, isUpdated: false } : c
      )
    );
  };

  const handleMyCourseScoreChange = (id: number, newScore: string) => {
    setMyCourses(prev =>
      prev.map(c =>
        c.id === id ? { ...c, score: newScore, isUpdated: false } : c
      )
    );
  };

  const handleSearchCategoryChange = (id: number, newCategory: string) => {
    setSearchResults(prev => {
      const next = prev.map(c =>
        c.id === id ? { ...c, category: newCategory } : c
      );
      const changed = next.find(c => c.id === id);
      console.log('카테고리 변경 후:', changed);
      return next;
    });
  };

  const handleSearchScoreChange = (id: number, newScore: string) => {
    setSearchResults(prev =>
      prev.map(c => (c.id === id ? { ...c, score: newScore } : c))
    );
  };

 const handleAddMyCourse = async (gwamok: Course) => {
  const targetCourse = searchResults.find(c => c.id === gwamok.id);
  if (!targetCourse) return;

  const payload = {
    lecId: targetCourse.lecid,
    grade: Number(targetCourse.grade),
    semester: Number(targetCourse.semester),
    lecType: targetCourse.category,
    credit: Number(targetCourse.credits),
    received_grade: getScoreValue(targetCourse.score),
  };

  try {
    setAddingCourse(targetCourse.id);               // ✅ 추가 시작
    await axios.post('/api/course/register', payload);
    const newCourse = { ...targetCourse, isAdded: true, isUpdated: false };
    setMyCourses(prev => {
      if (prev.find(c => c.lecid === newCourse.lecid)) return prev;
      return [...prev, newCourse];
    });
  } catch (error) {
    console.error('추가 실패:', error);
    alert('오류가 발생했습니다.');
  } finally {
    setAddingCourse(null);                          // ✅ 추가 종료
  }
};

  const handleRemoveMyCourse = async (id: number) => {
    const target = myCourses.find(c => c.id === id);
    if (!target) return;

    try {
      setDeletingCourse(id);
      await axios.delete(`/api/course/${target.lecid}`);
      setMyCourses(prev => prev.filter(course => course.id !== id));
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setDeletingCourse(null);
    }
  };

  // 조회 결과 페이지 계산
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE);
  const emptyRows = ITEMS_PER_PAGE - currentItems.length;

  // 내 수강 과목 페이지 계산 (5개씩)
  const myIndexOfLastItem = myPage * MY_ITEMS_PER_PAGE;
  const myIndexOfFirstItem = myIndexOfLastItem - MY_ITEMS_PER_PAGE;
  const myCurrentItems = myCourses.slice(myIndexOfFirstItem, myIndexOfLastItem);
  const myTotalPages = Math.ceil(myCourses.length / MY_ITEMS_PER_PAGE);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">학점 관리</h1>

      {/* 이수 과목 정리 + 내 수강 과목 */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">이수 과목 정리</h2>

        {/* 상단 리스트 (내 수강 과목) */}
        {loadingMyCourses ? (
          <div className="mb-8 border-2 border-pink-100 bg-pink-50 rounded-xl p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p className="text-lg font-semibold text-pink-600">
                내 수강 과목 로딩중...
              </p>
            </div>
          </div>
        ) : myCourses.length > 0 ? (
          <div className="mb-8 border-2 border-pink-100 bg-pink-50 rounded-xl">
            <div className="flex justify-between items-center mb-3 px-4 pt-4">
              <h3 className="text-lg font-bold text-pink-600">
                📚 내가 수강한 과목{' '}
                <span className="text-sm font-normal text-gray-600">
                  ({myCourses.length}개)
                </span>
              </h3>
              <span className="text-sm font-bold text-pink-600">
                총 {myCourses.reduce((acc, cur) => acc + cur.credits, 0)}학점
              </span>
            </div>
            <div className="bg-white rounded-lg overflow-hidden border border-pink-200">
              <table className="min-w-full divide-y divide-pink-100">
                <thead className="bg-pink-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-bold text-pink-800 uppercase w-1/5">
                      과목명
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-pink-800 uppercase w-1/5">
                      과목코드
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-pink-800 uppercase w-1/5">
                      이수구분
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-pink-800 uppercase w-1/5">
                      학점
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-pink-800 uppercase w-1/5">
                      성적
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-bold text-pink-800 uppercase w-1/5">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-pink-100">
                  {myCurrentItems.map(course => (
                    <tr
                      key={course.id}
                      className="hover:bg-pink-50 transition-colors"
                    >
                      <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">
                        {course.name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">
                        {course.lecid}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <select
                          value={course.category}
                          onChange={e =>
                            handleMyCourseCategoryChange(
                              course.id,
                              e.target.value
                            )
                          }
                          className="text-sm border border-pink-200 rounded p-1 focus:ring-pink-400 focus:border-pink-400 bg-white text-gray-700 cursor-pointer"
                        >
                          <option>전공필수</option>
                          <option>전공선택</option>
                          <option>전공기초</option>
                          <option>교양필수</option>
                          <option>교양선택</option>
                          <option>일반선택</option>
                          <option>기본소양</option>
                          <option>다중전공</option>
                          <option>전공기반</option>
                          <option>공학전공</option>
                        </select>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 font-medium">
                        {course.credits}학점
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 font-bold">
                        <select
                          value={course.score || 'A+'}
                          onChange={e =>
                            handleMyCourseScoreChange(
                              course.id,
                              e.target.value
                            )
                          }
                          className="text-sm border border-pink-200 rounded p-1 focus:ring-pink-400 focus:border-pink-400 bg-white text-gray-700 cursor-pointer"
                        >
                          <option>A+</option>
                          <option>A0</option>
                          <option>A-</option>
                          <option>B+</option>
                          <option>B0</option>
                          <option>B-</option>
                          <option>C+</option>
                          <option>C0</option>
                          <option>C-</option>
                          <option>D+</option>
                          <option>D0</option>
                          <option>D-</option>
                          <option>F</option>
                          <option>P</option>
                          <option>NP</option>
                        </select>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-center space-x-2">
                        <button
                          onClick={() =>
                            updateCourseInfo(
                              course.lecid,
                              course.category,
                              course.score || 'A+'
                            )
                          }
                          disabled={
                            course.isUpdated || updatingCourse === course.lecid
                          }
                          className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition
                            ${
                              course.isUpdated || updatingCourse === course.lecid
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                : 'bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 border border-blue-100'
                            }`}
                        >
                          {updatingCourse === course.lecid
                            ? '수정중...'
                            : course.isUpdated
                            ? '수정완료'
                            : '수정'}
                        </button>

                        <button
                          onClick={() => handleRemoveMyCourse(course.id)}
                          disabled={deletingCourse === course.id}
                          className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm transition
                            ${
                              deletingCourse === course.id
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                                : 'bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 border-red-100'
                            }`}
                        >
                          {deletingCourse === course.id ? '삭제중...' : '삭제'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 내 수강 과목 페이지네이션 (5개씩) */}
              {myCourses.length > 0 && (
                <div className="flex justify-center items-center p-3 border-t border-pink-100 bg-pink-50 gap-1 text-xs">
                  <button
                    onClick={() => setMyPage(1)}
                    disabled={myPage === 1}
                    className="px-2 py-1 rounded bg-white border border-pink-200 text-pink-600 disabled:opacity-30 hover:bg-pink-100"
                  >
                    {'<<'}
                  </button>
                  <button
                    onClick={() =>
                      setMyPage(prev => Math.max(prev - 1, 1))
                    }
                    disabled={myPage === 1}
                    className="px-2 py-1 rounded bg_WHITE border border-pink-200 text-pink-600 disabled:opacity-30 hover:bg-pink-100"
                  >
                    {'<'}
                  </button>

                  {getPaginationGroup(myPage, myTotalPages).map(page => (
                    <button
                      key={page}
                      onClick={() => setMyPage(page)}
                      className={`px-3 py-1 rounded border font-medium ${
                        myPage === page
                          ? 'bg-pink-400 text-white border-pink-400'
                          : 'bg-white text-pink-600 border-pink-200 hover:bg-pink-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setMyPage(prev => Math.min(prev + 1, myTotalPages))
                    }
                    disabled={myPage === myTotalPages}
                    className="px-2 py-1 rounded bg-white border border-pink-200 text-pink-600 disabled:opacity-30 hover:bg-pink-100"
                  >
                    {'>'}
                  </button>
                  <button
                    onClick={() => setMyPage(myTotalPages)}
                    disabled={myPage === myTotalPages}
                    className="px-2 py-1 rounded bg-white border border-pink-200 text-pink-600 disabled:opacity-30 hover:bg-pink-100"
                  >
                    {'>>'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-8 border-2 border-pink-100 bg-pink-50 rounded-xl p-8 text-center">
            <p className="text-gray-500">수강한 과목이 없습니다.</p>
          </div>
        )}

        {/* 🔍 검색 필터 섹션 */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🔍 강의 검색</h3>

          <div className="flex flex-wrap gap-4 items-end">
            <div className="w-40">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                학년
              </label>
              <select
                value={selectedGrade}
                onChange={handleGradeChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white cursor-pointer"
              >
                <option value="all">전체 학년</option>
                <option value="1">1학년</option>
                <option value="2">2학년</option>
                <option value="3">3학년</option>
                <option value="4">4학년</option>
              </select>
            </div>

            {selectedGrade !== 'all' && (
              <div className="w-40 animate-fade-in">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  학기
                </label>
                <select
                  value={selectedSemester}
                  onChange={e => setSelectedSemester(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white cursor-pointer"
                >
                  <option value="all">전체 학기</option>
                  <option value="1">1학기</option>
                  <option value="2">여름학기</option>
                  <option value="3">2학기</option>
                  <option value="4">겨울학기</option>
                </select>
              </div>
            )}

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                과목명 검색
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="과목명을 입력하세요"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>
            </div>

            <div className="w-32">
              <button
                onClick={handleSearchClick}
                className="w-full p-3 mt-2 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition disabled:bg-gray-300"
                disabled={loading}
              >
                {loading ? '조회 중...' : '조회'}
              </button>
            </div>
          </div>
        </div>

        {/* 하단 리스트 (조회 결과) */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 font-bold text-gray-700 flex justify-between items-center">
            <span>조회 결과 ({searchResults.length}건)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/6">
                    학년/학기
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/6">
                    과목코드
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/6">
                    과목명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/6">
                    이수구분
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/6">
                    학점
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/6">
                    성적
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase w-1/6">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map(course => (
                  <tr
                    key={course.id}
                    className="hover:bg-gray-50 h-16 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.grade}학년{' '}
                      {SemesterNumberChange(course.semester)}학기
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {course.lecid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {course.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={course.category}
                        onChange={e =>
                          handleSearchCategoryChange(
                            course.id,
                            e.target.value
                          )
                        }
                        className="text-sm border border-gray-300 rounded p-1 focus:ring-pink-400 focus:border-pink-400"
                      >
                        <option>전공필수</option>
                        <option>전공선택</option>
                        <option>전공기초</option>
                        <option>교양필수</option>
                        <option>교양선택</option>
                        <option>일반선택</option>
                        <option>기본소양</option>
                        <option>다중전공</option>
                        <option>전공기반</option>
                        <option>공학전공</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={course.credits}
                        disabled
                        className="w-16 text-sm border border-pink-200 rounded p-1 bg-pink-50 text-pink-600 font-medium text-center cursor-not-allowed"
                      />
                      <span className="ml-1 text-sm text-gray-500">
                        학점
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={course.score || 'A+'}
                        onChange={e =>
                          handleSearchScoreChange(course.id, e.target.value)
                        }
                        className="text-sm border border-gray-300 rounded p-1 focus:ring-pink-400 focus:border-pink-400 font-medium text-gray-700"
                      >
                        <option>A+</option>
                        <option>A0</option>
                        <option>A-</option>
                        <option>B+</option>
                        <option>B0</option>
                        <option>B-</option>
                        <option>C+</option>
                        <option>C0</option>
                        <option>C-</option>
                        <option>D+</option>
                        <option>D0</option>
                        <option>D-</option>
                        <option>F</option>
                        <option>P</option>
                        <option>NP</option>
                      </select>
                    </td>
                   <td className="px-6 py-4 whitespace-nowrap text-center">
  <button
    onClick={() => handleAddMyCourse(course)}
    disabled={course.isAdded || addingCourse === course.id}
    className={`px-4 py-1.5 rounded text-sm font-medium transition-all duration-200 ${
      course.isAdded || addingCourse === course.id
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-pink-400 text-white hover:bg-pink-500 shadow-sm hover:shadow'
    }`}
  >
    {course.isAdded
      ? '추가 완료'
      : addingCourse === course.id
      ? '추가중...'
      : '추가'}
  </button>
</td>

                  </tr>
                ))}

                {Array.from({ length: emptyRows }).map((_, index) => (
                  <tr
                    key={`empty-${index}`}
                    className="h-16 border-b border-gray-50"
                  >
                    <td colSpan={7}></td>
                  </tr>
                ))}

                {searchResults.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-10 text-center text-gray-500 h-64"
                    >
                      조건에 맞는 개설 강좌가 없습니다.
                    </td>
                  </tr>
                )}

                {loading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-10 text-center text-gray-500 h-64"
                    >
                      조회 중입니다...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {searchResults.length > 0 && (
            <div className="flex justify-center items-center p-4 border-t border-gray-200 bg-gray-50 gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded bg-white border border-gray-300 text-gray-600 disabled:opacity-30 hover:bg-gray-100 text-xs"
              >
                {'<<'}
              </button>
              <button
                onClick={() =>
                  setCurrentPage(prev => Math.max(prev - 5, 1))
                }
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-white border border-gray-300 text-gray-600 disabled:opacity-30 hover:bg-gray-100"
              >
                &lt;
              </button>

              {getPaginationGroup(currentPage, totalPages).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded border font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-pink-400 text-white border-pink-400'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage(prev => Math.min(prev + 5, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-white border border-gray-300 text-gray-600 disabled:opacity-30 hover:bg-gray-100"
              >
                &gt;
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 rounded bg-white border border-gray-300 text-gray-600 disabled:opacity-30 hover:bg-gray-100 text-xs"
              >
                {'>>'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;

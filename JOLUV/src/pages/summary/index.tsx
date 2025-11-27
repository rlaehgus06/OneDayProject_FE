import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TotalCredits from '../../components/displayCredits/totalCredits';
import EachCredits from '../../components/displayCredits/eachCredits';

interface Course {
  id: number;
  lecid: string; 
  name: string;
  credits: number;
  category: string;
  grade: number;
  semester: number;
  isAdded?: boolean;
  score?: string;
}

const ITEMS_PER_PAGE = 10;

const getScoreValue = (score: string = 'A+'): number => {
  const scoreMap: { [key: string]: number } = {
    'A+': 4.5, 'A0': 4.0,
    'B+': 3.5, 'B0': 3.0,
    'C+': 2.5, 'C0': 2.0,
    'D+': 1.5, 'D0': 1.0,
    'F': 0.0, 'P': 0.0, 'NP': 0.0
  };
  return scoreMap[score] || 0.0;
};

const getPaginationGroup = (currentPage: number, totalPages: number) => {
  const start = Math.floor((currentPage - 1) / 5) * 5 + 1;
  return Array.from({ length: Math.min(5, totalPages - start + 1) }, (_, i) => start + i);
};

const SummaryPage: React.FC = () => {
  const [myCourses, setMyCourses] = useState<Course[]>([]); // 내 과목 리스트
  const [selectedGrade, setSelectedGrade] = useState('all');    
  const [selectedSemester, setSelectedSemester] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');
  
  const [allData, setAllData] = useState<Course[]>([]); // 전체 과목 리스트 (원본)
  const [searchResults, setSearchResults] = useState<Course[]>([]); // 화면 표시용
  
  const [currentPage, setCurrentPage] = useState(1);

  // 1. 초기 데이터 로딩 (전체 과목 + 내 과목 병렬 호출)
  useEffect(() => {
    const loadAllData = async () => {
      if(selectedGrade === 'all' || selectedSemester === 'all') {
        setAllData([]);
        setSearchResults([]);
        return;
      }

      try {
        // [핵심 수정] Promise.all로 두 API를 동시에 호출하여 기다림
        const [allCoursesRes, myCoursesRes] = await Promise.all([
          // 1. 전체 개설 과목 가져오기
          axios.get('/api/lecture/list', { 
            params: { grade: selectedGrade, semester: selectedSemester }
          }),
          // 2. 내가 이미 추가한 과목 가져오기 (엔드포인트는 예시입니다. 실제에 맞게 수정하세요)
          axios.get('/api/my-lecture/list') 
        ]);

        // 2-1. 내 과목 데이터 가공
        // 백엔드에서 오는 데이터 필드명에 맞춰서 매핑해주세요 (예: lecid, lectype 등)
        const myFetchedCourses: Course[] = myCoursesRes.data.map((course: any, idx: number) => ({
          id: idx, // 혹은 course.id
          lecid: course.lecid || course.lecId,
          name: course.lectureName || course.name,
          credits: course.credit || course.credits,
          category: course.lecType || course.category,
          grade: course.grade,
          semester: course.semester,
          score: course.received_grade ? String(course.received_grade) : 'A+', // 점수 역변환 로직 필요할 수 있음
          isAdded: true
        }));

        setMyCourses(myFetchedCourses); // 내 과목 상태 저장

        // 1-1. 전체 과목 데이터 가공 (+ 내 과목과 대조하여 isAdded 설정)
        const allFetchedCourses: Course[] = allCoursesRes.data.map((course: any, idx: number) => {
          const realLecId = course.lecId || course.lecid || course.lectureCode || String(idx);
          
          // [핵심 로직] 내 과목 리스트에 이 과목 코드가 있는지 확인!
          const alreadyExists = myFetchedCourses.some(my => my.lecid === realLecId);

          return {
            id: idx, 
            lecid : realLecId, 
            name: course.lectureName,
            credits: course.credit,
            category: course.lectureType,
            grade: course.grade || parseInt(selectedGrade),
            semester: course.semester || parseInt(selectedSemester),
            score: 'A+',
            isAdded: alreadyExists // 여기서 true면 버튼이 비활성화됨
          };
        });
        
        setAllData(allFetchedCourses);      
        setSearchResults(allFetchedCourses);

      } catch (error) {
        console.error('데이터 불러오기 실패:', error);
        setAllData([]);
        setSearchResults([]);
        // 에러 상황에서도 기존 내 과목은 유지하거나 초기화 선택
      }
      setCurrentPage(1);
    };

    loadAllData();
  }, [selectedGrade, selectedSemester]); // 검색어 제외, 학년/학기 변경 시에만 로딩


  // 3. 검색어 필터링 (프론트엔드 처리)
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults(allData); 
    } else {
      const filtered = allData.filter(course => 
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    }
    setCurrentPage(1); 
  }, [searchTerm, allData]);


  // 4. 내 과목(myCourses) 변경 시, 전체 목록의 버튼 상태도 동기화
  useEffect(() => {
    const syncAddedStatus = (list: Course[]) => 
      list.map(item => ({
        ...item,
        isAdded: myCourses.some(my => my.lecid === item.lecid)
      }));

    setAllData(prev => syncAddedStatus(prev));
    setSearchResults(prev => syncAddedStatus(prev));
  }, [myCourses]);


  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGrade = e.target.value;
    setSelectedGrade(newGrade);
    if (newGrade === 'all') setSelectedSemester('all');
  };

  const updateCourseInfo = async (lecid: string, lectype: string, score: string) => {
    const payload = { lecid, lectype, received_grade: getScoreValue(score) };
    try {
      await axios.post('/api/course/update', payload);
    } catch (error) { console.error("수정 실패", error); }
  };

  const handleMyCourseCategoryChange = (id: number, newCategory: string) => {
    setMyCourses(prev => prev.map(c => c.id === id ? { ...c, category: newCategory } : c));
    const target = myCourses.find(c => c.id === id);
    if (target) updateCourseInfo(target.lecid, newCategory, target.score || 'A+');
  };

  const handleMyCourseScoreChange = (id: number, newScore: string) => {
    setMyCourses(prev => prev.map(c => c.id === id ? { ...c, score: newScore } : c));
    const target = myCourses.find(c => c.id === id);
    if (target) updateCourseInfo(target.lecid, target.category, newScore);
  };

  const handleSearchCategoryChange = (id: number, newCategory: string) => {
    const updateFn = (list: Course[]) => list.map(c => c.id === id ? { ...c, category: newCategory } : c);
    setSearchResults(prev => updateFn(prev));
    setAllData(prev => updateFn(prev));
  };
  
  const handleSearchScoreChange = (id: number, newScore: string) => {
    const updateFn = (list: Course[]) => list.map(c => c.id === id ? { ...c, score: newScore } : c);
    setSearchResults(prev => updateFn(prev));
    setAllData(prev => updateFn(prev));
  };

  const handleAddMyCourse = async (id: number) => {
    const targetCourse = searchResults.find(c => c.id === id);
    if (!targetCourse) return;

    const payload = {
      lecId: targetCourse.lecid,
      grade: Number(targetCourse.grade),
      semester: Number(targetCourse.semester),
      lecType: targetCourse.category,
      credit: Number(targetCourse.credits),
      received_grade: getScoreValue(targetCourse.score)
    };

    try {
      await axios.post('/api/course/register', payload); 
      
      // 성공하면 내 목록에 추가 (isAdded는 자동으로 true가 됨)
      const newCourse = { ...targetCourse, isAdded: true };
      
      setMyCourses(prev => {
        if (prev.find(c => c.lecid === newCourse.lecid)) return prev;
        return [...prev, newCourse];
      });
      
      // useEffect([myCourses])가 동작하면서 searchResults의 버튼 상태도 자동으로 업데이트됨

    } catch (error) {
      console.error("추가 실패:", error);
      alert("오류 발생");
    }
  };

  const handleRemoveMyCourse = async (id: number) => {
    const target = myCourses.find(c => c.id === id);
    if (!target) return;

    try {
      await axios.delete(`/api/course/${target.lecid}`);
      
      // 내 목록에서 제거 -> useEffect([myCourses])가 돌면서 전체 목록 버튼 상태도 '추가'로 돌아옴
      setMyCourses(prev => prev.filter(course => course.id !== id));

    } catch (error) {
      console.error("삭제 실패:", error);
      alert("오류 발생");
    }
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE);
  const emptyRows = ITEMS_PER_PAGE - currentItems.length;

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">학점 관리</h1>

      {/* 상단 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-2 lg:col-span-2">
          <TotalCredits total={120} completed={90} percentage={75.0} />
        </div>
        <div className="md:col-span-1 lg:col-span-1">
          <EachCredits title="전공 학점" score={50} />
        </div>
        <div className="md:col-span-1 lg:col-span-1">
          <EachCredits title="교양 학점" score={30} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">이수 과목 정리</h2>
        
        {/* 필터 섹션 */}
        <div className="flex flex-wrap gap-4 mb-6 items-end">
          <div className="w-40">
            <label className="block text-sm font-medium text-gray-700 mb-1">학년</label>
            <select value={selectedGrade} onChange={handleGradeChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white cursor-pointer">
              <option value="all">전체 학년</option>
              <option value="1">1학년</option>
              <option value="2">2학년</option>
              <option value="3">3학년</option>
              <option value="4">4학년</option>
            </select>
          </div>
          {selectedGrade !== 'all' && (
            <div className="w-40 animate-fade-in">
              <label className="block text-sm font-medium text-gray-700 mb-1">학기</label>
              <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white cursor-pointer">
                <option value="all">전체 학기</option>
                <option value="1">1학기</option>
                <option value="2">여름학기</option>
                <option value="3">2학기</option>
                <option value="4">겨울학기</option>
              </select>
            </div>
          )}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">과목명 검색</label>
            <div className="relative">
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="과목명을 입력하세요" className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>
        </div>

        {/* 상단 리스트 (내 수강 과목) */}
        {myCourses.length > 0 && (
          <div className="mb-8 border-2 border-pink-100 bg-pink-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4 px-2">
              <h3 className="text-lg font-bold text-pink-600">📚 내가 수강한 과목 <span className="text-sm font-normal text-gray-600">({myCourses.length}개)</span></h3>
              <span className="text-sm font-bold text-pink-600">총 {myCourses.reduce((acc, cur) => acc + cur.credits, 0)}학점</span>
            </div>
            <div className="bg-white rounded-lg overflow-hidden border border-pink-200">
              <table className="min-w-full divide-y divide-pink-100">
                <thead className="bg-pink-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-pink-800 uppercase w-1/5">과목명</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-pink-800 uppercase w-1/5">과목코드</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-pink-800 uppercase w-1/5">이수구분</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-pink-800 uppercase w-1/5">학점</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-pink-800 uppercase w-1/5">성적</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-pink-800 uppercase w-1/5">관리</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-pink-100">
                  {myCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-pink-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{course.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{course.lecid}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select value={course.category} onChange={(e) => handleMyCourseCategoryChange(course.id, e.target.value)} className="text-sm border border-pink-200 rounded p-1 focus:ring-pink-400 focus:border-pink-400 bg-white text-gray-700 cursor-pointer">
                          <option>전공필수</option><option>전공선택</option><option>전공기초</option><option>교양필수</option><option>교양선택</option><option>일반선택</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{course.credits}학점</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">
                        <select value={course.score || 'A+'} onChange={(e) => handleMyCourseScoreChange(course.id, e.target.value)} className="text-sm border border-pink-200 rounded p-1 focus:ring-pink-400 focus:border-pink-400 bg-white text-gray-700 cursor-pointer">
                          <option>A+</option><option>A0</option><option>B+</option><option>B0</option><option>C+</option><option>C0</option><option>D+</option><option>D0</option><option>F</option><option>P</option><option>NP</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button onClick={() => handleRemoveMyCourse(course.id)} className="text-gray-400 hover:text-red-500 font-medium transition-colors">삭제</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 하단 리스트 */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 font-bold text-gray-700 flex justify-between items-center">
            <span>조회 결과 ({searchResults.length}건)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/6">학년/학기</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/6">과목코드</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/6">과목명</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/6">이수구분</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/6">학점</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/6">성적</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase w-1/6">관리</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 h-16 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.grade}학년 {course.semester}학기</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{course.lecid}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{course.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select value={course.category} onChange={(e) => handleSearchCategoryChange(course.id, e.target.value)} className="text-sm border border-gray-300 rounded p-1 focus:ring-pink-400 focus:border-pink-400">
                        <option>전공필수</option><option>전공선택</option><option>전공기초</option><option>교양필수</option><option>교양선택</option><option>일반선택</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="number" value={course.credits} disabled className="w-16 text-sm border border-pink-200 rounded p-1 bg-pink-50 text-pink-600 font-medium text-center cursor-not-allowed" />
                      <span className="ml-1 text-sm text-gray-500">학점</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select value={course.score || 'A+'} onChange={(e) => handleSearchScoreChange(course.id, e.target.value)} className="text-sm border border-gray-300 rounded p-1 focus:ring-pink-400 focus:border-pink-400 font-medium text-gray-700">
                        <option>A+</option><option>A0</option><option>B+</option><option>B0</option><option>C+</option><option>C0</option><option>D+</option><option>D0</option><option>F</option><option>P</option><option>NP</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button onClick={() => handleAddMyCourse(course.id)} disabled={course.isAdded} className={`px-4 py-1.5 rounded text-sm font-medium transition-all duration-200 ${course.isAdded ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-pink-400 text-white hover:bg-pink-500 shadow-sm hover:shadow'}`}>
                        {course.isAdded ? '추가 완료' : '추가'}
                      </button>
                    </td>
                  </tr>
                ))}
                {Array.from({ length: emptyRows }).map((_, index) => (
                  <tr key={`empty-${index}`} className="h-16 border-b border-gray-50"><td colSpan={7}></td></tr>
                ))}
                {searchResults.length === 0 && (
                  <tr><td colSpan={7} className="px-6 py-10 text-center text-gray-500 h-64">조건에 맞는 개설 강좌가 없습니다.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 컨트롤 */}
          {searchResults.length > 0 && (
            <div className="flex justify-center items-center p-4 border-t border-gray-200 bg-gray-50 gap-1">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-2 py-1 rounded bg-white border border-gray-300 text-gray-600 disabled:opacity-30 hover:bg-gray-100 text-xs">{'<<'}</button>
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 5, 1))} disabled={currentPage === 1} className="px-3 py-1 rounded bg-white border border-gray-300 text-gray-600 disabled:opacity-30 hover:bg-gray-100">&lt;</button>
              
              {getPaginationGroup(currentPage, totalPages).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded border font-medium transition-colors ${currentPage === page ? 'bg-pink-400 text-white border-pink-400' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                >
                  {page}
                </button>
              ))}

              <button onClick={() => setCurrentPage(prev => Math.min(prev + 5, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 rounded bg-white border border-gray-300 text-gray-600 disabled:opacity-30 hover:bg-gray-100">&gt;</button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="px-2 py-1 rounded bg-white border border-gray-300 text-gray-600 disabled:opacity-30 hover:bg-gray-100 text-xs">{'>>'}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;

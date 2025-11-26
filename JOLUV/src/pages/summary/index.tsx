import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TotalCredits from '../../components/displayCredits/totalCredits';
import EachCredits from '../../components/displayCredits/eachCredits';

interface Course {
  id: number;
  name: string;
  credits: number;
  category: string;
  grade: number;
  semester: number;
  isAdded?: boolean;
  score?: string;
}


const ITEMS_PER_PAGE = 10;

const SummaryPage: React.FC = () => {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  
  // 필터 상태
  const [selectedGrade, setSelectedGrade] = useState('all');    
  const [selectedSemester, setSelectedSemester] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');
  
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchFilteredCourses = async () => {
      if(selectedGrade !== 'all' && selectedSemester !== 'all') {
        try {
          const response = await axios.get('/api/lecture/standard', {
            params: { 
              grade: selectedGrade,
              semester: selectedSemester
            }
          });
          const fetchedCourses: Course[] = response.data.map((course: any) => ({
            id: course.id,
            name: course.name,
            credits: course.credits,
            category: course.category,
            grade: selectedGrade ? parseInt(selectedGrade) : 0,
            semester: selectedSemester ? parseInt(selectedSemester) : 0,
            score: 'A+',
            isAdded: false
          }));
        setSearchResults(fetchedCourses);


        
        }catch (error) {
          console.error('과목 불러오기 실패:', error);

          const filtered = allCourses.filter(course =>
            course.grade === parseInt(selectedGrade) &&
            course.semester === parseInt(selectedSemester)
          );
          setSearchResults(filtered);
        }
      }
    
    else
    {
      let filitered = allCourses;

      if(selectedGrade !== 'all') {
        filitered = filitered.filter(course => course.grade === parseInt(selectedGrade));
      }
      if (searchTerm.trim() !== '') {
        filitered = filitered.filter(course =>
          course.name.includes(searchTerm.trim())
        );
      }
      setSearchResults(filitered);

    }
    };
    fetchFilteredCourses();

    setCurrentPage(1); // 필터 변경 시 1페이지로 이동
  }, [selectedGrade, selectedSemester,searchTerm, allCourses]);

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGrade = e.target.value;
    setSelectedGrade(newGrade);
    if (newGrade === 'all') setSelectedSemester('all');
  };

  const handleCategoryChange = (id: number, newCategory: string) => {
    setAllCourses(prev => prev.map(course => 
      course.id === id ? { ...course, category: newCategory } : course
    ));
  };

  const handleScoreChange = (id: number, newScore: string) => {
    setAllCourses(prev => prev.map(course => 
      course.id === id ? { ...course, score: newScore } : course
    ));
  };

  const handleAddMyCourse = (id: number) => {
    setAllCourses(prev => prev.map(course => 
      course.id === id ? { ...course, isAdded: true } : course
    ));
  };

  const handleRemoveMyCourse = (id: number) => {
    setAllCourses(prev => prev.map(course => 
      course.id === id ? { ...course, isAdded: false } : course
    ));
  };

  // 내가 수강한 과목 리스트
  const myAddedCourses = allCourses.filter(course => course.isAdded);

  // 페이지네이션 계산
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
              <label className="block text-sm font-medium text-gray-700 mb-1">학기</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white cursor-pointer"
              >
                <option value="all">전체 학기</option>
                <option value="1">1학기</option>
                <option value="2">2학기</option>
              </select>
            </div>
          )}

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">과목명 검색</label>
            <div className="relative">
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="과목명을 입력하세요"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>
        </div>

        {/* 내가 수강한 과목 리스트 (상단) */}
        {myAddedCourses.length > 0 && (
          <div className="mb-8 border-2 border-pink-100 bg-pink-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4 px-2">
              <h3 className="text-lg font-bold text-pink-600">
                📚 내가 수강한 과목 <span className="text-sm font-normal text-gray-600">({myAddedCourses.length}개)</span>
              </h3>
              <span className="text-sm font-bold text-pink-600">
                총 {myAddedCourses.reduce((acc, cur) => acc + cur.credits, 0)}학점
              </span>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden border border-pink-200">
              <table className="min-w-full divide-y divide-pink-100">
                <thead className="bg-pink-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-pink-800 uppercase w-1/5">과목명</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-pink-800 uppercase w-1/5">이수구분</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-pink-800 uppercase w-1/5">학점</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-pink-800 uppercase w-1/5">성적</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-pink-800 uppercase w-1/5">관리</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-pink-100">
                  {myAddedCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-pink-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {course.name}
                      </td>
                      {/* 이수구분 수정 가능 */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={course.category}
                          onChange={(e) => handleCategoryChange(course.id, e.target.value)}
                          className="text-sm border border-pink-200 rounded p-1 focus:ring-pink-400 focus:border-pink-400 bg-white text-gray-700 cursor-pointer"
                        >
                          <option>전공필수</option>
                          <option>전공선택</option>
                          <option>전공기초</option>
                          <option>교양필수</option>
                          <option>교양선택</option>
                          <option>일반선택</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                        {course.credits}학점
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">
                        {course.score}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button 
                          onClick={() => handleRemoveMyCourse(course.id)}
                          className="text-gray-400 hover:text-red-500 font-medium transition-colors"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 조회 결과 리스트 (하단) */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 font-bold text-gray-700 flex justify-between items-center">
            <span>조회 결과 ({searchResults.length}건)</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/6">학년/학기</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/6">과목명</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/6">이수구분</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/6">학점</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/6">성적</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase w-1/6">관리</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* 데이터 행 */}
                {currentItems.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 h-16 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.grade}학년 {course.semester}학기
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {course.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={course.category}
                        onChange={(e) => handleCategoryChange(course.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded p-1 focus:ring-pink-400 focus:border-pink-400"
                      >
                        <option>전공필수</option>
                        <option>전공선택</option>
                        <option>전공기초</option>
                        <option>교양필수</option>
                        <option>교양선택</option>
                        <option>일반선택</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={course.credits}
                        disabled
                        className="w-16 text-sm border border-pink-200 rounded p-1 bg-pink-50 text-pink-600 font-medium text-center cursor-not-allowed"
                      />
                      <span className="ml-1 text-sm text-gray-500">학점</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={course.score || 'A+'}
                        onChange={(e) => handleScoreChange(course.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded p-1 focus:ring-pink-400 focus:border-pink-400 font-medium text-gray-700"
                      >
                        <option>A+</option>
                        <option>A0</option>
                        <option>B+</option>
                        <option>B0</option>
                        <option>C+</option>
                        <option>C0</option>
                        <option>D+</option>
                        <option>D0</option>
                        <option>F</option>
                        <option>P</option>
                        <option>NP</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleAddMyCourse(course.id)}
                        disabled={course.isAdded}
                        className={`
                          px-4 py-1.5 rounded text-sm font-medium transition-all duration-200
                          ${course.isAdded 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-pink-400 text-white hover:bg-pink-500 shadow-sm hover:shadow'}
                        `}
                      >
                        {course.isAdded ? '추가 완료' : '추가'}
                      </button>
                    </td>
                  </tr>
                ))}

                {/* 빈 행 채우기 (높이 고정) */}
                {Array.from({ length: emptyRows }).map((_, index) => (
                  <tr key={`empty-${index}`} className="h-16 border-b border-gray-50">
                    <td colSpan={6}></td>
                  </tr>
                ))}

                {/* 데이터 없을 때 메시지 */}
                {searchResults.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500 h-64">
                      조건에 맞는 개설 강좌가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 컨트롤 */}
          {searchResults.length > 0 && (
            <div className="flex justify-center items-center p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 rounded bg-white border border-gray-300 text-gray-600 disabled:opacity-50 hover:bg-gray-100"
              >
                &lt;
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 mx-1 rounded border ${
                    currentPage === i + 1 
                      ? 'bg-pink-400 text-white border-pink-400' 
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 rounded bg-white border border-gray-300 text-gray-600 disabled:opacity-50 hover:bg-gray-100"
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
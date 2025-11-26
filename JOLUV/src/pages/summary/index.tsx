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

const SAMPLE_COURSES: Course[] = [
  { id: 1, name: '자료구조', credits: 3, category: '전공필수', grade: 2, semester: 1, score: 'A+' },
  { id: 2, name: '객체지향프로그래밍', credits: 3, category: '전공필수', grade: 2, semester: 1, score: 'A+' },
  { id: 3, name: '컴퓨터구조', credits: 3, category: '전공필수', grade: 2, semester: 2, score: 'A+' },
  { id: 4, name: '운영체제', credits: 3, category: '전공필수', grade: 3, semester: 1, score: 'A+' },
  { id: 5, name: '데이터베이스', credits: 3, category: '전공선택', grade: 3, semester: 1, score: 'A+' },
  { id: 6, name: '알고리즘', credits: 3, category: '전공필수', grade: 3, semester: 2, score: 'A+' },
  { id: 7, name: '소프트웨어공학', credits: 3, category: '전공선택', grade: 4, semester: 1, score: 'A+' },
  { id: 8, name: '졸업프로젝트', credits: 3, category: '전공필수', grade: 4, semester: 2, score: 'A+' },
  { id: 9, name: 'C프로그래밍', credits: 3, category: '전공기초', grade: 1, semester: 1, score: 'A+' },
  { id: 10, name: '글쓰기', credits: 2, category: '교양필수', grade: 1, semester: 1, score: 'A+' },
  { id: 11, name: '일반물리학', credits: 3, category: '교양필수', grade: 1, semester: 2, score: 'A+' },
  { id: 12, name: '인공지능', credits: 3, category: '전공선택', grade: 3, semester: 1, score: 'A+' },
];

const SummaryPage: React.FC = () => {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  
  const [selectedGrade, setSelectedGrade] = useState('all');    
  const [selectedSemester, setSelectedSemester] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');
  
  const [searchResults, setSearchResults] = useState<Course[]>([]);

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const initializedCourses = SAMPLE_COURSES.map(c => ({ ...c, score: 'A+' }));
        setAllCourses(initializedCourses);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      }
    };
    fetchAllCourses();
  }, []);

  useEffect(() => {
    let filtered = allCourses;

    if (selectedGrade !== 'all') {
      filtered = filtered.filter(course => course.grade === parseInt(selectedGrade));
    }

    if (selectedGrade !== 'all' && selectedSemester !== 'all') {
      filtered = filtered.filter(course => course.semester === parseInt(selectedSemester));
    }

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(course => 
        course.name.includes(searchTerm.trim())
      );
    }

    setSearchResults(filtered);
  }, [selectedGrade, selectedSemester, searchTerm, allCourses]);

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGrade = e.target.value;
    setSelectedGrade(newGrade);
    if (newGrade === 'all') setSelectedSemester('all');
  };

  const handleCategoryChange = (id: number, newCategory: string) => {
    const updateCourse = (list: Course[]) => list.map(course => 
      course.id === id ? { ...course, category: newCategory } : course
    );
    setAllCourses(prev => updateCourse(prev));
  };

  const handleScoreChange = (id: number, newScore: string) => {
    const updateCourse = (list: Course[]) => list.map(course => 
      course.id === id ? { ...course, score: newScore } : course
    );
    setAllCourses(prev => updateCourse(prev));
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

  const myAddedCourses = allCourses.filter(course => course.isAdded);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">학점 관리</h1>

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

        {/* 내가 수강한 과목 */}
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
                    <th className="px-6 py-3 text-left text-xs font-bold text-pink-800 uppercase">과목명</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-pink-800 uppercase">이수구분</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-pink-800 uppercase">학점</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-pink-800 uppercase">성적</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-pink-800 uppercase">관리</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-pink-100">
                  {myAddedCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-pink-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {course.name}
                      </td>
                      
                      {/* 👇 이수구분 변경 가능하도록 수정됨 */}
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

        {/* 조회 결과 리스트 */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 font-bold text-gray-700 flex justify-between items-center">
            <span>조회 결과 ({searchResults.length}건)</span>
          </div>
          
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200 relative">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">학년/학기</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">과목명</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이수구분</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">학점</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">성적</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">관리</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {searchResults.length > 0 ? (
                  searchResults.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50 transition-colors">
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                      조건에 맞는 개설 강좌가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
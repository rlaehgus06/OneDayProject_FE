import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TotalCredits from '../../components/displayCredits/totalCredits';
import EachCredits from '../../components/displayCredits/eachCredits';

interface Course {
  id: number;
  name: string;
  credits: number;
  grade: string;
  category: string;
}

const SummaryPage: React.FC = () => {
  // 초기값을 빈 배열로 설정
  const [courses, setCourses] = useState<Course[]>([]);

  const [courseName, setCourseName] = useState('');
  const [credits, setCredits] = useState('3');
  const [grade, setGrade] = useState('A+');
  const [category, setCategory] = useState('전공필수');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/api/v1/courses');
        
        console.log('🔴 서버 응답 원본 데이터:', response.data); // 👈 콘솔에서 이 로그를 꼭 확인하세요!

        // ⚠️ 중요: 서버 데이터가 배열인지 확인하고 넣기
        if (Array.isArray(response.data)) {
          // 1. 바로 배열로 온 경우 (Best)
          setCourses(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          // 2. { data: [...] } 형태로 감싸져서 온 경우
          setCourses(response.data.data);
        } else if (response.data && Array.isArray(response.data.result)) {
          // 3. { result: [...] } 형태로 감싸져서 온 경우
          setCourses(response.data.result);
        } else {
          // 4. 배열을 찾을 수 없는 경우 -> 빈 배열로 유지하여 에러 방지
          console.error('서버 데이터가 배열 형태가 아닙니다.');
          setCourses([]); 
        }

      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
        setCourses([]); // 에러 나면 빈 배열로 초기화
      }
    };

    fetchCourses();
  }, []);

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName || !credits) {
      alert('과목명과 학점을 입력해주세요.');
      return;
    }

    const newCourse: Course = {
      id: Date.now(),
      name: courseName,
      credits: parseInt(credits, 10),
      grade: grade,
      category: category,
    };

    // courses가 배열이 아닐 경우를 대비해 안전하게 처리
    setCourses(prev => Array.isArray(prev) ? [...prev, newCourse] : [newCourse]);
    
    setCourseName('');
    setCredits('3');
  };

  const handleDeleteCourse = (id: number) => {
    setCourses(prev => Array.isArray(prev) ? prev.filter(course => course.id !== id) : []);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">학점 관리</h1>

      {/* 상단 학점 요약 카드 */}
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

      {/* 학점 직접 입력 및 리스트 섹션 */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">학점 직접 입력</h2>

        <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 items-end">
           {/* ... 입력 폼 내용은 기존과 동일 ... */}
           {/* (코드 길이상 생략했지만, 기존 폼 코드 그대로 두시면 됩니다) */}
           <div>
            <label className="block text-sm font-medium text-gray-700">과목명</label>
            <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="예) 자료구조" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">학점</label>
            <input type="number" value={credits} onChange={(e) => setCredits(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">성적</label>
            <select value={grade} onChange={(e) => setGrade(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
              <option>A+</option><option>A0</option><option>B+</option><option>B0</option><option>C+</option><option>C0</option><option>D+</option><option>D0</option><option>F</option><option>P</option><option>NP</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">이수구분</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
              <option>전공필수</option><option>전공선택</option><option>교양</option><option>창업교과목</option><option>기타</option>
            </select>
          </div>
          <button type="submit" className="bg-pink-400 text-white p-2 rounded-md shadow-sm hover:bg-pink-500 h-10 font-semibold transition duration-200">추가</button>
        </form>

        {/* 👇 안전 장치 추가: courses가 배열일 때만 map 실행 */}
        <div className="overflow-x-auto border-t border-gray-200 pt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">과목명</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학점</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">성적</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이수구분</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* 👇 여기서 Array.isArray() 체크를 추가하여 에러를 방지합니다. */}
              {!Array.isArray(courses) || courses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    등록된 과목이 없습니다.
                  </td>
                </tr>
              ) : (
                courses.map((course, index) => (
                  <tr key={course.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.credits}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.grade}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
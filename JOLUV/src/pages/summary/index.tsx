import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TotalCredits from '../../components/displayCredits/totalCredits';
import EachCredits from '../../components/displayCredits/eachCredits';

// 과목 타입 정의
interface Course {
  id: number;
  name: string;
  credits: number;
  grade: string;
  category: string;
}

const SummaryPage: React.FC = () => {
  // 과목 리스트 상태(직접 입력 + 서버에서 받아온 데이터)
  const [courses, setCourses] = useState<Course[]>([]);

  // 입력폼 상태
  const [courseName, setCourseName] = useState('');
  const [credits, setCredits] = useState('3');
  const [grade, setGrade] = useState('A+');
  const [category, setCategory] = useState('전공필수');

  // 서버에서 강의 데이터 받아오기
  useEffect(() => {
    axios.get<Course[]>('http://16.176.198.162:8080/api/v1/courses')
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error('강의 목록을 불러오지 못했습니다:', error);
      });
  }, []);

  // 입력폼 추가 기능
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName || !credits) {
      alert('과목명과 학점을 모두 입력해주세요.');
      return;
    }
    const newCourse: Course = {
      id: Date.now(),
      name: courseName,
      credits: parseInt(credits, 10),
      grade,
      category,
    };
    setCourses([...courses, newCourse]);
    setCourseName('');
    setCredits('3');
  };

  // 삭제 기능
  const handleDeleteCourse = (id: number) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">학점 관리</h1>
      {/* 학점 요약 카드 */}
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
      {/* 학점 직접 입력 섹션 */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">학점 직접 입력</h2>
        <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">과목명</label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="예) 자료구조"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">학점</label>
            <input
              type="number"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">성적</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option>A+</option><option>A0</option><option>B+</option><option>B0</option>
              <option>C+</option><option>C0</option><option>D+</option><option>D0</option>
              <option>F</option><option>P</option><option>NP</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">이수구분</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option>전공필수</option><option>전공선택</option>
              <option>교양</option><option>창업교과목</option><option>기타</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-pink-400 text-white p-2 rounded-md shadow-sm hover:bg-pink-500 h-10"
          >
            추가
          </button>
        </form>
        {/* 과목 테이블 */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">과목명</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">학점</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">성적</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이수구분</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">관리</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    추가된 과목이 없습니다.
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{course.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{course.credits}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{course.grade}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{course.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-red-600 hover:text-red-900"
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

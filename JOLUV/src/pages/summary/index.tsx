import React, { useState } from 'react'; // 1. useState를 import 합니다.
import TotalCredits from '../../components/displayCredits/totalCredits';
import EachCredits from '../../components/displayCredits/eachCredits';

// 2. 입력받을 과목의 타입을 정의합니다.
interface Course {
  id: number; // 고유 식별자 (삭제 시 필요)
  name: string;
  credits: number;
  grade: string;
  category: string;
}

const SummaryPage: React.FC = () => {
  // 3. 입력된 과목들을 저장할 리스트(배열) 상태
  const [courses, setCourses] = useState<Course[]>([]);

  // 4. 현재 입력폼의 값들을 관리할 상태
  const [courseName, setCourseName] = useState('');
  const [credits, setCredits] = useState('3'); // 기본값 3학점
  const [grade, setGrade] = useState('A+'); // 기본값 A+
  const [category, setCategory] = useState('전공필수'); // 기본값 전공필수

  // 5. "추가" 버튼 클릭 시 실행될 함수
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    // 기본 유효성 검사
    if (!courseName || !credits) {
      alert('과목명과 학점을 모두 입력해주세요.');
      return;
    }

    const newCourse: Course = {
      id: Date.now(), // 간단한 고유 ID 생성
      name: courseName,
      credits: parseInt(credits, 10), // 입력값을 숫자로 변환
      grade: grade,
      category: category,
    };

    // 기존 과목 리스트에 새 과목 추가
    setCourses([...courses, newCourse]);

    // 입력창 초기화
    setCourseName('');
    setCredits('3');
  };

  // 6. "삭제" 버튼 클릭 시 실행될 함수
  const handleDeleteCourse = (id: number) => {
    // ID가 일치하지 않는 과목들만 남기고 리스트를 새로 만듦
    setCourses(courses.filter(course => course.id !== id));
  };

  return (
    <div className=" min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">학점 관리</h1>

      {/* 1. 상단 학점 요약 카드 */}
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

      {/* 2. 학점 직접 입력 섹션 (새로 추가된 부분) */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">학점 직접 입력</h2>

        {/* 입력 폼 */}
        <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 items-end">
          {/* 과목명 입력 */}
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
          {/* 학점 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">학점</label>
            <input
              type="number"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          {/* 성적 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">성적</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option>A+</option><option>A0</option><option>B+</option><option>B0</option><option>C+</option><option>C0</option><option>D+</option><option>D0</option><option>F</option><option>P</option><option>NP</option>
            </select>
          </div>
          {/* 이수구분 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">이수구분</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option>전공필수</option><option>전공선택</option><option>교양</option><option>창업교과목</option><option>기타</option>
            </select>
          </div>
          {/* 추가 버튼 */}
          <button
            type="submit"
            className="bg-pink-400 text-white p-2 rounded-md shadow-sm hover:bg-pink-500 h-10"
          >
            추가
          </button>
        </form>

        {/* 입력된 과목 리스트 테이블 */}
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
                // 과목이 없을 때
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    추가된 과목이 없습니다.
                  </td>
                </tr>
              ) : (
                // 과목 리스트 맵핑
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
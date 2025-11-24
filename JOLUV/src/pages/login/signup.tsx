import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupPage: React.FC = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  // ❌ passwordConfirm 상태 삭제됨
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [major, setMajor] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ❌ 비밀번호 일치 확인 로직 삭제됨

    try {
      const response = await axios.post('/api/signup', {
        userId: id,
        password: password,
        name: name,
        StudentId: studentId,
        major: major,
      });

      console.log('회원가입 성공:', response.data);
      alert('회원가입이 완료되었습니다! 로그인해주세요.');
      navigate('/login');

    } catch (error) {
      console.error('회원가입 실패:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
        alert(`회원가입 실패: ${errorMessage}`);
      } else {
        alert('서버와 연결할 수 없습니다.');
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-8">
        
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            회원가입
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            
            {/* 1. 아이디 */}
            <div>
              <label htmlFor="id" className="sr-only">아이디</label>
              <input
                id="id"
                name="id"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="아이디"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>

            {/* 2. 비밀번호 */}
            <div>
              <label htmlFor="password" className="sr-only">비밀번호</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* ❌ 비밀번호 확인 입력창 삭제됨 */}

            {/* 3. 이름 */}
            <div>
              <label htmlFor="name" className="sr-only">이름</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* 4. 학번 */}
            <div>
              <label htmlFor="studentId" className="sr-only">학번</label>
              <input
                id="studentId"
                name="studentId"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="학번 (예: 2023123456)"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>

            {/* 5. 전공 */}
            <div>
              <label htmlFor="major" className="sr-only">전공</label>
              <input
                id="major"
                name="major"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="전공 (예: 컴퓨터학부)"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
              />
            </div>

          </div>

          {/* 가입 버튼 */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-400 hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition duration-150 ease-in-out"
            >
              회원가입
            </button>
          </div>

          {/* 로그인 페이지 링크 */}
          <div className="text-center mt-4">
            <span className="text-gray-600">이미 계정이 있으신가요? </span>
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              로그인
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SignupPage;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignupPage: React.FC = () => {
  // 1. 회원가입에 필요한 정보들을 기억하기 위한 상태(state)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // 2. 회원가입 버튼을 눌렀을 때 실행될 함수
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 페이지 새로고침 방지

    // 비밀번호와 비밀번호 확인이 일치하는지 검사
    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return; // 일치하지 않으면 함수 종료
    }

    console.log('회원가입 시도:', { name, email, password });
    // TODO: 여기에 실제 서버로 회원가입 요청을 보내는 API 호출 코드를 추가합니다.
  };

  return (
    // 👇 1. flex-col을 지우고, 폼을 중앙 정렬하기 위해 flex items-center justify-center를 추가
    <div className="bg-gray-100 min-h-screen font-sans flex items-center justify-center">
      
      {/* 👇 2. Header Section (헤더 전체가 삭제되었습니다)
      */}

      {/* 👇 3. main 태그를 div로 변경하고, flex-grow를 삭제 */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        

        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">회원가입</h1>
        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
              이름
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@knu.ac.kr"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password Confirmation Input */}
          <div className="mb-6">
            <label htmlFor="password-confirm" className="block text-gray-700 font-semibold mb-2">
              비밀번호 확인
            </label>
            <input
              type="password"
              id="password-confirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="********"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-pink-400 text-white py-3 rounded-lg font-bold hover:bg-pink-600 transition duration-300"
          >
            회원가입
          </button>

          {/* Link to Login Page */}
          <div className="text-center mt-6">
            <span className="text-gray-600">이미 계정이 있으신가요? </span>
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              로그인
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
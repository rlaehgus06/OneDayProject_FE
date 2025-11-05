import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('로그인 시도:', { email, password });
    // TODO: 여기에 실제 서버로 로그인 요청을 보내는 API 호출 코드를 추가합니다.
  };

  return (
    // 👇 flex flex-col을 삭제하고, 폼을 중앙 정렬하기 위해 flex items-center justify-center를 추가
    <div className="bg-gray-100 min-h-screen font-sans flex items-center justify-center">
      
      {/* Header Section
        이 부분이 삭제되었습니다.
      */}

      {/* Login Form Section */}
      {/* 👇 main 태그 대신 div를 사용하고, flex-grow를 삭제 */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        
        {/* KNU 로고를 폼 상단에 추가 (옵션) */}
        <div className="text-center mb-6">
          <Link to="/" className="text-3xl font-bold text-blue-600">
            KNU
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">로그인</h1>
        <form onSubmit={handleSubmit}>
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300"
          >
            Log In
          </button>
          
          <div className="text-center mt-6">
            <span className="text-gray-600">계정이 없으신가요? </span>
            <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
              회원가입
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
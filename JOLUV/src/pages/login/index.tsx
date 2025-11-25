import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';  // axios import

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://16.176.198.162:8080/', {
        email,
        password
      });
      console.log('로그인 성공:', response.data);
      // 로그인 성공 후 처리 (예: 토큰 저장, 페이지 이동 등)
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  

  return (
    <div className="bg-gray-100 min-h-screen font-sans flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">로그인</h1>
        <form onSubmit={handleSubmit}>
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

          <button
            type="submit"
            className="w-full bg-pink-400 text-white py-3 rounded-lg font-bold hover:bg-pink-600 transition duration-300"
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

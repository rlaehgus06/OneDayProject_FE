import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage: React.FC = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await axios.post('/api/auth/login', {
      key: id,
      value: password,
    }, {
      // 세션 쿠키 쓰면 필요
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('login res:', res.data.sessionId);
    // 백엔드에서 101을 "로그인 성공"으로 정했다면
      alert('Login 성공');

      // 세션 ID를 따로 내려주는 구조면
      if (res.data.sessionId) {
        sessionStorage.setItem('sessionId', res.data.sessionId);
      }
      navigate('/mypage');
   
  } catch (error) {
    console.error(error);
    alert('로그인 중 오류가 발생했습니다.');
  }
};

    return (
        <div className="bg-gray-100 min-h-screen font-sans flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">

                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">로그인</h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="id" className="block text-gray-700 font-semibold mb-2">아이디</label>
                        <input
                            type="text"
                            id="id"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-pink-400 text-white py-3 rounded-lg font-bold hover:bg-pink-500 transition duration-300"
                    >
                        Log In
                    </button>

                    <div className="text-center mt-6">
                        <span className="text-gray-600">계정이 없으신가요? </span>
                        <Link to="/signup" className="text-blue-600 font-semibold hover:underline">회원가입</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
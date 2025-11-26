import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext'; // 👈 import 추가

const LoginPage: React.FC = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // 👈 login 함수 가져오기

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/login', {
        username: id,
        password: password,
      });

      console.log('로그인 성공:', response.data);
      
      // 토큰 저장 (백엔드에서 주는 토큰 이름 확인 필요, 예: accessToken)
      if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
      }
      
      login(); // 👈 로그인 상태 true로 변경!
      
      // alert('로그인되었습니다!');
      navigate('/'); 

    } catch (error) {
      // ... (에러 처리 코드 동일)
      console.error('로그인 에러:', error);
      if (axios.isAxiosError(error)) {
        // ...
        alert(`로그인 실패: ${error.message}`);
      }
    }
  };

  // ... (return 부분 동일)
  return (
    <div className="bg-gray-100 min-h-screen font-sans flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">로그인</h1>
        <form onSubmit={handleSubmit}>
            {/* ... (입력 필드들 동일) ... */}
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
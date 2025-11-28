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
      // 👇 핵심 변경: POST -> GET
      // axios.get은 데이터를 보낼 때 두 번째 인자에 { params: { ... } } 형태로 넣어야 합니다.
      const response = await axios.get('/api/auth/login', {
        params: {
          userId: id, 
          password: password,
        },
        withCredentials: true, // 쿠키를 포함하려면 이 옵션을 추가합니다
      });
  
      console.log('로그인 성공: kk', response.data.accessToken
      );
      
      // 토큰 저장 (백엔드 응답 구조에 따라 다를 수 있음)
      if (response.data && response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
      }

      // alert('로그인되었습니다!');
      

    } catch (error) {
      console.error('로그인 에러:', error);
      
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401) {
          alert('아이디 또는 비밀번호가 틀렸습니다.');
        } else if (status === 500) {
          alert('서버 내부 오류입니다.');
        } else {
          alert(`로그인 실패: ${error.message}`);
        }
      } else {
        alert('서버와 연결할 수 없습니다.');
      }
    }
    navigate('/summary'); 
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        
        {/* 👇 1. KNU 로고 부분 삭제됨 */}
        
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">로그인</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="id" className="block text-gray-700 font-semibold mb-2">아이디</label>
            <input
              type="text"
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" // 포커스링도 핑크로 변경
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" // 포커스링도 핑크로 변경
              required
            />
          </div>
          
          {/* 👇 2. 버튼 색상 변경 (blue -> pink) */}
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
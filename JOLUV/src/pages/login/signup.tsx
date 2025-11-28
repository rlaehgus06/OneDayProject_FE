import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupPage: React.FC = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [major, setMajor] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 전공 선택 여부 확인
    if (!major) {
      alert('전공을 선택해주세요.');
      return;
    }

    // 1. JSON 데이터 객체 생성
    // (@RequestBody는 JSON 형식을 받습니다)
    const signupData = {
      userId: id,
      password: password, // 혹시 또 'rawPassword cannot be null' 에러가 나면 키 이름을 'rawPassword'로 바꿔주세요.
      name: name,
      studentId: parseInt(studentId) || 0, // 백엔드 타입(Long/Int)에 맞춰 숫자로 변환
      major: major,
    };

    try {
      // 2. axios.post 요청 (기본적으로 JSON으로 전송됨)
      const response = await axios.post('/api/auth/signup', signupData, {
        headers: {
            'Content-Type': 'application/json' // 명시적으로 JSON 설정
        }
      });

      console.log('회원가입 응답:', response);

      // 3. 성공 처리
      // 백엔드가 리다이렉트 문자열("redirect:...")을 리턴하더라도,
      // Axios가 이를 따라가서 최종적으로 200 OK를 받으면 성공으로 처리합니다.
      if (response.status === 200) {
        alert('회원가입이 완료되었습니다! 로그인해주세요.');
        navigate('/login'); 
      }

    } catch (error: any) {
      console.error('회원가입 실패:', error);
      
      let errorMessage = '회원가입 중 오류가 발생했습니다.';
      
      if (axios.isAxiosError(error)) {
        // 에러 응답 데이터 처리
        const errorData = error.response?.data;
        
        if (typeof errorData === 'string') {
             // HTML 에러 페이지가 올 경우를 대비해 메시지 필터링
             if (!errorData.includes('<html')) {
                 errorMessage = errorData;
             }
        } else if (errorData?.message) {
            errorMessage = errorData.message;
        }

        // 409 Conflict (중복 등)
        if (error.response?.status === 409) {
             alert(`가입 실패: ${errorMessage}`);
        } else {
             alert(`회원가입 실패: ${errorMessage}`);
        }
      } else {
        alert('서버와 연결할 수 없습니다.');
      }
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-8 border border-gray-200">
        
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
              <select
                id="major"
                name="major"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm bg-white"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
              >
                <option value="" disabled>전공을 선택하세요</option>
                <option value="플랫폼SW융합전공">플랫폼SW융합전공</option>
                <option value="글로벌SW융합전공">글로벌SW융합전공</option>
                <option value="인공지능컴퓨팅전공">인공지능컴퓨팅전공</option>
                <option value="심화컴퓨팅전공">심화컴퓨팅전공</option>
              </select>
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
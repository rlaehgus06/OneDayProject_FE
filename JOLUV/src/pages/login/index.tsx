import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    
    // ✨ 에러 메시지를 저장할 state 추가
    const [errorMessage, setErrorMessage] = useState<string>(''); 

    const navigate = useNavigate();
    const { isLoggedIn, userId, login, logout } = useAuth();

    // 입력창에 타이핑 시작하면 에러 메시지 초기화 (UX 향상)
    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setId(e.target.value);
        if (errorMessage) setErrorMessage('');
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (errorMessage) setErrorMessage('');
    };

    // ----------------------------------------------------------------------
    // 로그인 제출 핸들러
    // ----------------------------------------------------------------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(''); // 요청 전 에러 초기화

        const formData = new URLSearchParams();
        formData.append('userId', id);
        formData.append('password', password);

        try {
            const response = await axios.post('/api/auth/login', formData, {
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded' 
                },
                withCredentials: true,
            });

            // 1. 응답 데이터가 HTML 문자열이면 -> 실패
            if (typeof response.data === 'string' && response.data.includes('<html')) {
                setErrorMessage("아이디 또는 비밀번호가 일치하지 않습니다."); // ✨ alert 대신 사용
                return;
            }

            // 2. 상태 코드 200 확인
            if (response.status === 200) {
                if (response.request?.responseURL && response.request.responseURL.includes('error')) {
                     setErrorMessage("아이디 또는 비밀번호가 일치하지 않습니다."); // ✨ alert 대신 사용
                     return;
                }

                login(id); 
                navigate("/"); 
            }

        } catch (error: any) {
            
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                     setErrorMessage("아이디 또는 비밀번호가 틀렸습니다."); // ✨
                } else if (error.code === "ERR_NETWORK") {
                    setErrorMessage("서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요."); // ✨
                } else {
                     setErrorMessage("로그인 처리 중 문제가 발생했습니다."); // ✨
                }
            } else {
                setErrorMessage("알 수 없는 오류가 발생했습니다."); // ✨
            }
        }
    };

    const handleLogout = async () => {
        try { logout(); } catch (error) {}
    };

    // ----------------------------------------------------------------------
    // 렌더링
    // ----------------------------------------------------------------------
    if (isLoggedIn) {
        return (
            <div className="bg-gray-100 min-h-screen font-sans flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">🔓</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">이미 로그인 상태입니다</h2>
                    <p className="text-gray-600 mb-8">
                        현재 <span className="font-bold text-pink-500">{userId}</span> 님으로 로그인되어 있습니다.
                    </p>
                    
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/mypage')}
                            className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition duration-300"
                        >
                            마이페이지로 이동
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition duration-300"
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                            onChange={handleIdChange} // ✨ 변경된 핸들러 연결
                            // 에러가 있으면 테두리를 빨갛게(red-500), 없으면 회색(gray-300)
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                                errorMessage ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="아이디를 입력하세요"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange} // ✨ 변경된 핸들러 연결
                            // 에러가 있으면 테두리를 빨갛게
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                                errorMessage ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="비밀번호를 입력하세요"
                            required
                        />
                    </div>

                    {/* ✨ 에러 메시지 표시 영역 (에러가 있을 때만 보임) */}
                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm flex items-center animate-pulse">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errorMessage}
                        </div>
                    )}

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
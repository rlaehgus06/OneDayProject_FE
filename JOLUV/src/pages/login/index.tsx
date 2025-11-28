import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { isLoggedIn, userId, login, logout } = useAuth();

    // ----------------------------------------------------------------------
    // 로그인 제출 핸들러
    // ----------------------------------------------------------------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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

            console.log('Login Response:', response);

            // 🚨 핵심 수정: 200 OK가 왔더라도 진짜 성공인지 확인해야 함
            
            // 1. 응답 데이터가 HTML 문자열이면 -> 실패 (로그인 페이지로 리다이렉트 된 것)
            if (typeof response.data === 'string' && response.data.includes('<html')) {
                alert("아이디 또는 비밀번호가 일치하지 않습니다.");
                return; // 함수 종료
            }

            // 2. 만약 백엔드가 특정 에러 코드(예: "code": "501")를 JSON으로 준다면 여기서 체크
            // (백엔드 응답 구조에 따라 다르지만, 보통 Form Login은 HTML을 뱉거나 리다이렉트함)
            
            // 3. 위의 실패 조건을 통과했다면 진짜 성공으로 간주
            if (response.status === 200) {
                // 성공 시에도 리다이렉트가 발생했을 수 있으므로, 
                // 최종 URL이 로그인 페이지(?error)인지 확인하는 방법도 있음
                if (response.request?.responseURL && response.request.responseURL.includes('error')) {
                     alert("아이디 또는 비밀번호가 일치하지 않습니다.");
                     return;
                }

                alert("Login 성공");
                login(id); // Context 상태 업데이트
                navigate("/");
            }

        } catch (error: any) {
            console.error('Login Error:', error);
            
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                     alert("아이디 또는 비밀번호가 틀렸습니다.");
                } else if (error.code === "ERR_NETWORK") {
                    // 아예 서버가 꺼져있거나 IP가 틀린 경우
                    alert("서버와 연결할 수 없습니다. 백엔드 서버 상태를 확인해주세요.");
                } else {
                     alert("로그인 처리 중 문제가 발생했습니다.");
                }
            } else {
                alert("알 수 없는 오류가 발생했습니다.");
            }
        }
    };

    // ----------------------------------------------------------------------
    // 로그아웃 핸들러
    // ----------------------------------------------------------------------
    const handleLogout = async () => {
        try {
            logout();
            alert("로그아웃 되었습니다.");
        } catch (error) {
            console.error(error);
        }
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
                            onChange={(e) => setId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="비밀번호를 입력하세요"
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
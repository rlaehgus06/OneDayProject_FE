import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Context에서 관리할 데이터 타입 정의
interface AuthContextType {
  isLoggedIn: boolean;
  userId: string | null;
  login: (id: string) => void;
  logout: () => void;
}

// Context 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider 컴포넌트 (App.tsx에서 전체를 감싸야 함)
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // 앱 실행 시 localStorage 확인하여 로그인 상태 복구
  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn");
    const storedUserId = localStorage.getItem("userId");
    
    if (storedLogin === "true" && storedUserId) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
    }
  }, []);

  // 로그인 함수
  const login = (id: string) => {
    setIsLoggedIn(true);
    setUserId(id);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userId", id);
  };

  // 로그아웃 함수
  const logout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    sessionStorage.removeItem("sessionId"); // 세션 ID도 삭제
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
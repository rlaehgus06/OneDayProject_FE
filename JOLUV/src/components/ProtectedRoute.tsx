import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();


  // 로그인이 되어 있으면 원래 보여주려던 페이지(children)를 보여줍니다.
  return <>{children}</>;
};

export default ProtectedRoute;
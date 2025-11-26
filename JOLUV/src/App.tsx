import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MainPage from './pages/main/Mainpage';
import LoginPage from './pages/login/index';
import SignupPage from './pages/login/signup';
import SummaryPage from './pages/summary/index'; 
import ChecklistPage from './pages/checklist/index'; 
import { AuthProvider } from './contexts/AuthContext'; 
import MyPage from './pages/mypage/MyPage';

function App() {
  return (
    <AuthProvider> 
      <Routes>
        {/* 👇 모든 페이지를 Layout 안으로 이동시켜 헤더가 보이게 함 */}
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="summary" element={<SummaryPage />} />
          <Route path="checklist" element={<ChecklistPage />} />
          <Route path="score-management" element={<SummaryPage />} /> 
          
          {/* 👇 로그인과 회원가입도 Layout 안으로 이동 */}
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
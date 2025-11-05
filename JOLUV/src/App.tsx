// src/App.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx'; // 👈 1. Layout을 import
import MainPage from './pages/main/Mainpage.tsx';
import LoginPage from './pages/login/index.tsx';
import SignupPage from './pages/login/signup.tsx';
import ChecklistPage from './pages/checklist/index.tsx';
import SummaryPage from './pages/summary/index.tsx';

function App() {
  return (
    <Routes>
      {/* 2. Layout 컴포넌트가 모든 자식 경로를 감싸도록 설정 */}
      <Route path="/" element={<Layout />}>
        {/* 👇 여기에 있는 페이지들은 모두 Header를 갖게 됩니다. */}
        <Route index element={<MainPage />} /> {/* 👈 path="/"와 동일 */}
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="checklist" element={<ChecklistPage />} />
        <Route path="summary" element={<SummaryPage />} />
        {/* (다른 페이지 경로들도 여기에 추가) */}
      </Route>
    </Routes>
  );
}

export default App;
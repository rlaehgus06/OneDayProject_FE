
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MainPage from './pages/main/Mainpage';
import MyPage from './pages/mypage/MyPage';
import LoginPage from './pages/login/index';
import SignupPage from './pages/login/signup';
import SummaryPage from './pages/summary/index'; 
import ChecklistPage from './pages/checklist/index'; 
import { AuthProvider } from './contexts/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute'; // 👈 import 추가
import ScoreManagementPage from './pages/score_management';

function App() {
  return (
    <AuthProvider> 
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          
          {/* 👇 마이페이지를 ProtectedRoute로 감싸서 보호합니다 */}
          <Route 
            path="mypage" 
            element={
              <ProtectedRoute>
                <MyPage /> {/* 실제 마이페이지 컴포넌트 (여기선 MainPage 재사용 중) */}
              </ProtectedRoute>
            } 
          />
          
          <Route path="summary" element={<SummaryPage />} />
          <Route path="checklist" element={<ChecklistPage />} />
          <Route path="score-management" element={<ScoreManagementPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
// src/components/Layout.tsx

import React from 'react';
import { Outlet } from 'react-router-dom'; // 👈 1. Outlet을 import
import Header from './Header'; // 👈 2. 방금 만든 Header를 import

const Layout: React.FC = () => {
  return (
    <div className=" min-h-screen font-sans">
      <Header /> {/* 👈 3. 헤더를 항상 렌더링 */}

      {/* 4. 메인 콘텐츠 영역 */}
      <main className="pt-20"> {/* 👈 5. 고정된 헤더 높이(pt-20)만큼 여백 주기 */}
        
        {/* 👇 이 <Outlet /> 부분에 페이지 본문이 렌더링됩니다. */}
        <Outlet /> 

      </main>
      
      {/* <Footer /> */} {/* (나중에 푸터를 추가할 자리) */}
    </div>
  );
};

export default Layout;
import React from 'react';
import { Link } from 'react-router-dom';

const SummaryPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 p-8">
      <h1 className="mb-8 text-4xl font-bold text-gray-800">
        요약 페이지
      </h1>
      <Link to="/" className="px-6 py-3 font-semibold text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600">
        메인 페이지로 돌아가기
      </Link>
    </div>
  );
};

export default SummaryPage; 
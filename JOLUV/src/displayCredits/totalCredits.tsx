import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ApiGraduationResponse {
  studentId: number;
  majorName: string;
  currentTotal: number;
  requiredTotal: number;
  missingMajor: number;
  missingGeneral: number;
}

function TotalCredits() {
  const [data, setData] = useState<ApiGraduationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiGraduationResponse>(
          '/api/graduation/simple',
          { withCredentials: true }
        );
        setData(response.data);
      } catch (err) {
        console.error("TotalCredits 데이터 로드 실패", err);
        setError("학점 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-6 text-center text-gray-500">로딩 중...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!data) return null;

  const totalCredits = data.requiredTotal;
  const completedCredits = data.currentTotal;

  const progressPercentage = totalCredits > 0 ? (completedCredits / totalCredits) * 100 : 0;
  const displayPercentage = progressPercentage.toFixed(1);
  const progressBarWidth = Math.min(progressPercentage, 100);

  return (
    // ⭐️ 수정됨: max-w-xl mx-auto 제거 -> w-full h-full로 변경하여 부모 크기에 맞춤 (왼쪽 정렬됨)
    <div className="w-full h-full p-6 border border-gray-200 rounded-xl shadow-lg bg-white space-y-4">
      <h2 className="text-xl font-semibold text-center text-gray-800 border-b pb-3">
        졸업 학점 이수 현황
      </h2>

      <div className="flex justify-center text-xl font-medium space-x-1">
        <span className="text-pink-400 font-bold">{completedCredits}학점</span>
        <span className="text-gray-500"> / </span>
        <span className="text-gray-800">{totalCredits}학점</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="h-3 rounded-full bg-pink-400 transition-all duration-500 ease-in-out"
          style={{ width: `${progressBarWidth}%` }}
          aria-valuenow={completedCredits}
          aria-valuemin={0}
          aria-valuemax={totalCredits}
        ></div>
      </div>

      <div className="text-center text-lg font-bold text-gray-700 pt-1">
        {displayPercentage}% 이수
      </div>
    </div>
  );
}

export default TotalCredits;
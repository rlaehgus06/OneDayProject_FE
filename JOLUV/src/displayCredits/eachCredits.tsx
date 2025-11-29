import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 백엔드 API 응답 데이터 타입 정의
interface ApiGraduationResponse {
  studentId: number;
  majorName: string;
  currentTotal: number;
  requiredTotal: number;
  missingMajor: number;   // 남은 전공 학점
  missingGeneral: number; // 남은 교양 학점
}

function EachCredits() {
  // 상태 관리
  const [data, setData] = useState<ApiGraduationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 컴포넌트 마운트 시 데이터 호출
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
        console.error("EachCredits 데이터 로드 실패", err);
        setError("세부 학점 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 로딩 및 에러 처리
  if (loading) return <div className="p-6 text-center text-gray-500">로딩 중...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!data) return null;

  // 데이터 매핑 (API에서 받아온 '부족한 학점'을 변수에 할당)
  const MajorCredits = data.missingMajor;
  const CultureCredits = data.missingGeneral;

  return (
    <div className="flex justify-center space-x-4 w-full max-w-4xl mx-auto h-full">
      {/* 1. 전공 학점 섹션 */}
      <div className="flex-1 p-6 border border-gray-200 rounded-xl shadow-lg bg-white space-y-4 h-full">
        <h2 className="text-2xl font-semibold text-center text-gray-800 border-b pb-3">
          남은 전공 학점
        </h2>
        <div className="flex justify-center text-4xl font-medium pt-3">
            {/* 0 이하면 완료, 아니면 점수 표시 */}
            {MajorCredits <= 0 ? (
                <span className="text-green-500 font-bold">이수 완료!</span>
            ) : (
                <span className="text-pink-400 font-bold">{MajorCredits}학점</span>
            )}
        </div>
      </div>

      {/* 2. 교양 학점 섹션 */}
      <div className="flex-1 p-6 border border-gray-200 rounded-xl shadow-lg bg-white space-y-4 h-full">
        <h2 className="text-2xl font-semibold text-center text-gray-800 border-b pb-3">
          남은 교양 학점
        </h2>
        <div className="flex justify-center text-4xl font-medium pt-3">
            {CultureCredits <= 0 ? (
                <span className="text-green-500 font-bold">이수 완료!</span>
            ) : (
                <span className="text-pink-400 font-bold">{CultureCredits}학점</span>
            )}
        </div>
      </div>
    </div>
  );
}

export default EachCredits;
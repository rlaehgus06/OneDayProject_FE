import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 백엔드 API 응답 데이터 타입 정의
interface ApiGraduationResponse {
  studentId: number;
  majorName: string;
  currentTotal: number;
  requiredTotal: number;
  missingMajor: number;
  missingGeneral: number;
}

function EachCredits() {
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
        console.error("EachCredits 데이터 로드 실패", err);
        setError("세부 학점 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-6 text-center text-gray-500">로딩 중...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!data) return null;

  const MajorCredits = data.missingMajor;
  const CultureCredits = data.missingGeneral;

  return (
    // ⭐️ 수정됨: max-w-4xl mx-auto 제거 -> w-full로 변경
    <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 w-full h-full">
      {/* 1. 전공 학점 섹션 */}
      <div className="flex-1 p-6 border border-gray-200 rounded-xl shadow-lg bg-white space-y-4 h-full">
        <h2 className="text-2xl font-semibold text-center text-gray-800 border-b pb-3">
            남은 전공 학점
        </h2>
        <div className="flex justify-center text-4xl font-medium pt-3">
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
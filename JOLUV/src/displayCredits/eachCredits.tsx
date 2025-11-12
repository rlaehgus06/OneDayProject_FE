import React from 'react';
import type { eachCredits } from '../types/totalCredits';

interface CreditProgressProps {
  data: eachCredits;
}
// 전공학점과 교양학점 표시하는 컴포넌트 (각각의 점수를 변수로 입력받음)
function EachCredits({ data }: CreditProgressProps) {
  const { MajorCredits, CultureCredits } = data;

  return (

    <div className="flex justify-center space-x-4 w-full max-w-4xl mx-auto h-full"> 
        
        {/* 1. 전공 학점 섹션: flex-1 적용하여 공간을 균등하게 차지하도록 함 */}
        <div className="flex-1 p-6 border border-gray-200 rounded-xl shadow-lg bg-white space-y-4 h-full">
            
            <h2 className="text-2xl font-semibold text-center text-gray-800 border-b pb-3">
                전공 학점
            </h2>

            <div className="flex justify-center text-4xl font-medium pt-3">
                 <span className="text-pink-400 font-bold">{MajorCredits}학점</span>
            </div>
        </div>
        
        {/* 2. 교양 학점 섹션: flex-1 적용하여 공간을 균등하게 차지하도록 함 */}
        <div className="flex-1  p-6 border border-gray-200 rounded-xl shadow-lg bg-white space-y-4 h-full">
      
            <h2 className="text-2xl font-semibold text-center text-gray-800 border-b pb-3">
                교양 학점
            </h2>

            <div className="flex justify-center text-4xl font-medium pt-3">
                <span className="text-pink-400 font-bold">{CultureCredits}학점</span>
            </div>
        </div>
    </div>
  );
}

export default EachCredits;
// pages/score_management/index.tsx
import React from 'react';
import Builtin from '../builtin_subject_list'; // 상대 경로 주의!
import TotalCredits from '../../displayCredits/totalCredits';
import EachCredits from '../../displayCredits/eachCredits';
export default function ScoreManagementPage() {
  return (
    <div>
      {/* 학점 정보 한 줄 → 별도 카드 래퍼 없이 바로 컴포넌트 표시 */}
      <div className="flex flex-col md:flex-row items-stretch max-w-[1360px] mx-auto mt-12 gap-8">
    <div className='flex-1'>
        <TotalCredits data={{ totalCredits: 120, completedCredits: 90 }} />
</div>
    <div className='flex-1'>
        <EachCredits data={{ MajorCredits: 50, CultureCredits: 30 }} />
</div>
      </div>
      {/* 아래 박스형 Builtin (파란 테두리 그대로) */}
      <div className="score-management-container max-w-[1360px] mx-auto mt-14">
        <div className="border-2 border-[#1976d2] rounded-xl p-8 bg-white shadow-md">
          <Builtin />
        </div>
      </div>
    </div>
  );
}


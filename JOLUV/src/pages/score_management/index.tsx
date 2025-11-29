import React from 'react';
import Builtin from '../builtin_subject_list'; 
import TotalCredits from '../../displayCredits/totalCredits';
import EachCredits from '../../displayCredits/eachCredits';

export default function ScoreManagementPage() {
  return (
    <div>
      {/* 학점 정보 섹션 */}
      <div className="flex flex-col md:flex-row items-stretch max-w-[1360px] mx-auto mt-12 gap-8">
        <div className='flex-1'>
            {/* ⭐️ 수정됨: data 속성 제거 */}
            <TotalCredits />
        </div>
        <div className='flex-1'>
            {/* ⭐️ 수정됨: data 속성 제거 */}
            <EachCredits />
        </div>
      </div>

      <div className="score-management-container w-full max-w-[1360px] mx-auto mt-14 ">
        <div className="border-2 border-black-400 rounded-xl p-8 bg-white h-[500px] overflow-y-auto custom-scrollbar">
          <Builtin />
        </div>
      </div>
    </div>
  );
}
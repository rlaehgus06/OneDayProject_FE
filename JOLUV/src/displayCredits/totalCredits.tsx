import type { graduacteCradits } from '../types/totalCredits';



// interface : 따라야 하는 규칙. 요구사항

interface CreditProgressProps {

data: graduacteCradits;

}



// React.FC를 사용하지 않고 함수 컴포넌트로 정의합니다.

function TotalCredits({ data }: CreditProgressProps) {

const { totalCredits, completedCredits } = data;

// 이수율 계산 (백분율)

const progressPercentage = (completedCredits / totalCredits) * 100;

// 소수점 1자리까지 표시

const displayPercentage = progressPercentage.toFixed(1);

// 진행률 바의 너비를 100%로 제한 (만약 초과 이수하더라도)

const progressBarWidth = Math.min(progressPercentage, 100);



return (

// credit-progress-container

<div className="max-w-xl mx-auto p-6 border border-gray-200 rounded-xl shadow-lg bg-white space-y-4 h-full">


{/* credit-progress-title */}

<h2 className="text-xl font-semibold text-center text-gray-800 border-b pb-3">

졸업 학점 이수 현황

</h2>



{/* 학점 정보 표시 (credit-info) */}

<div className="flex justify-center text-xl font-medium space-x-1">

<span className="text-pink-400 font-bold">{completedCredits}학점</span>

<span className="text-gray-500"> / </span>

<span className="text-gray-800">{totalCredits}학점</span>

</div>



{/* 진행률 바 (progress-bar-base) */}

<div className="w-full bg-gray-200 rounded-full h-3">

<div

// progress-bar-fill

className="h-3 rounded-full bg-pink-400 transition-all duration-500 ease-in-out"

style={{ width: `${progressBarWidth}%` }}

// 접근성을 위한 속성

aria-valuenow={completedCredits}

aria-valuemin={0}

aria-valuemax={totalCredits}

></div>

</div>



{/* 백분율 표시 (percentage-display) */}

<div className="text-center text-lg font-bold text-gray-700 pt-1">

{displayPercentage}% 이수

</div>

</div>

);

}



export default TotalCredits;
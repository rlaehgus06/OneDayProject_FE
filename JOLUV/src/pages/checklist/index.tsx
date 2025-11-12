import React, { useState } from 'react'; // 1. useState를 import 합니다.

// ----------------------------------------------------------------------
// 1. RequirementRowProps 인터페이스 수정 (세부 항목 'details' 추가)
// ----------------------------------------------------------------------
interface RequirementRowProps {
  title: string;
  progress: string;
  status: '완료' | '진행중' | '미완료';
  percentage: number;
  details?: { name: string; grade: string }[]; // 세부 수강 내역 (옵션)
}

// ----------------------------------------------------------------------
// 2. RequirementRow 컴포넌트 수정 (펼치기 기능 추가)
// ----------------------------------------------------------------------
const RequirementRow: React.FC<RequirementRowProps> = ({ title, progress, status, percentage, details }) => {
  // 2. 컴포넌트 자신이 "열렸는지" 기억하는 상태
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = () => {
    switch (status) {
      case '완료':
        return 'bg-green-100 text-green-700';
      case '진행중':
        return 'bg-yellow-100 text-yellow-700';
      case '미완료':
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // 3. 'details'가 있을 때만 클릭 가능하도록 설정
  const handleToggle = () => {
    if (details) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div
      className={`p-4 border-b ${details ? 'hover:bg-gray-50 cursor-pointer' : ''
        } transition-colors`}
      onClick={handleToggle}
    >
      {/* 기본 정보 (제목, 진행률, 상태) */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        {/* 왼쪽: 제목 + 프로그레스 바 */}
        <div className="flex-1 mb-4 sm:mb-0">
          <span className="text-lg font-semibold text-gray-800">{title}</span>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-pink-400 h-2.5 rounded-full"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* 오른쪽: 진행도(텍스트) + 상태 뱃지 */}
        <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-end sm:ml-6">
          <span className="text-gray-600 sm:mb-1">{progress}</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge()} sm:ml-0 ml-4`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* 👇 4. 펼쳐졌을 때(isExpanded) 세부 내역을 보여주는 부분 */}
      {isExpanded && details && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-2">수강 내역:</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-1 pl-5">
            {details.map((course, index) => (
              <li key={index}>
                <span className="font-medium">{course.name}</span> ({course.grade})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// 3. 체크리스트 메인 페이지 (데이터에 'details' 추가)
// ----------------------------------------------------------------------
const ChecklistPage: React.FC = () => {
  // 예시 데이터 (details 추가됨)
  const requirements: RequirementRowProps[] = [
    {
      title: '전공학점',
      progress: '31 / 60',
      status: '진행중',
      percentage: (31 / 60) * 100,
      details: [ // '전공학점'에 대한 세부 내역
        { name: '자료구조', grade: 'A+' },
        { name: '운영체제', grade: 'A0' },
        { name: '컴퓨터네트워크', grade: 'B+' },
      ]
    },
    { title: '부전공', progress: '0 / 21', status: '미완료', percentage: 0 }, // 'details'가 없으므로 클릭 안 됨
    {
      title: '교양과목',
      progress: '24 / 30',
      status: '진행중',
      percentage: (24 / 30) * 100,
      details: [ // '교양과목'에 대한 세부 내역
        { name: '글쓰기', grade: 'P' },
        { name: '영어회화', grade: 'A0' },
      ]
    },
    { title: '해외 대학 인정학점', progress: '0 학점', status: '미완료', percentage: 0 },
    { title: '현장실습', progress: '3 학점', status: '완료', percentage: 100 },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      
      {/* 1. 프로필 섹션 */}
      <section className="flex items-center p-6 bg-white rounded-lg shadow-md mb-8">
        <div className="w-20 h-20 bg-gray-300 rounded-full mr-6">
          {/* <img src="..." alt="프로필 사진" className="w-full h-full rounded-full object-cover" /> */}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">JOLUV 님</h2>
          <p className="text-xl text-gray-600 mt-1">컴퓨터학부 SW글로벌 융합전공</p>
          <p className="text-lg text-pink-500 mt-1">세부 트랙 :
            <span className="text-gray-700 font-semibold ml-2">다중전공 트랙</span>
          </p>
        </div>
      </section>
      
      {/* 2. 페이지 타이틀 */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">졸업 check List</h1>
      
      {/* 3. 요건 리스트 섹션 */}
      <section className="bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-t-lg border-b">
          <span className="text-xs font-medium text-gray-500 uppercase">졸업 요건</span>
          <span className="text-xs font-medium text-gray-500 uppercase">진행 현황</span>
        </div>
        <div>
          {requirements.map((req) => (
            <RequirementRow
              key={req.title}
              title={req.title}
              progress={req.progress}
              status={req.status}
              percentage={req.percentage}
              details={req.details} // 5. details 데이터를 prop으로 전달
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ChecklistPage;
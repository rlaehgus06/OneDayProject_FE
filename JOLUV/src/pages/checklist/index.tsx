import React, { useState } from 'react';

// ----------------------------------------------------------------------
// RequirementRowProps 인터페이스 (세부 항목 details 추가)
// ----------------------------------------------------------------------
interface RequirementRowProps {
  title: string;
  progress: string;
  status: '완료' | '진행중' | '미완료';
  percentage: number;
  details?: { name: string; grade: string }[]; // 세부 수강 내역 (옵션)
}

// ----------------------------------------------------------------------
// RequirementRow 컴포넌트 (펼치기 기능 포함)
// ----------------------------------------------------------------------
const RequirementRow: React.FC<RequirementRowProps> = ({
  title,
  progress,
  status,
  percentage,
  details
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = () => {
    switch (status) {
      case '완료': return 'bg-green-100 text-green-700';
      case '진행중': return 'bg-yellow-100 text-yellow-700';
      case '미완료':
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleToggle = () => {
    if (details) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div
      className={`p-4 border-b ${details ? 'hover:bg-gray-50 cursor-pointer' : ''} transition-colors`}
      onClick={handleToggle}
    >
      {/* 기본 정보 */}
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
      {/* 세부 내역: 펼치기 */}
      {isExpanded && details && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-2">수강 내역:</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-1 pl-5">
            {details.map((course, idx) => (
              <li key={idx}>
                <span className="font-medium">{course.name}</span> ({course.grade})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 트랙 옵션과 트랙별 요구사항 데이터 구조
// ----------------------------------------------------------------------
const TRACK_OPTIONS = [
  { value: 'multiMajor', label: '다중전공트랙' },
  { value: 'bsMs', label: '학-석사연계 트랙' },
  { value: 'dualDegree', label: '해외복수학위 트랙' },
];

// 트랙별 졸업요건 데이터
const REQUIREMENTS_BY_TRACK: Record<string, RequirementRowProps[]> = {
  multiMajor: [
    {
      title: '전공학점',
      progress: '31 / 60',
      status: '진행중',
      percentage: (31 / 60) * 100,
      details: [
        { name: '자료구조', grade: 'A+' },
        { name: '운영체제', grade: 'A0' },
        { name: '컴퓨터네트워크', grade: 'B+' }
      ]
    },
    { title: '부전공', progress: '0 / 21', status: '미완료', percentage: 0 },
    {
      title: '교양과목',
      progress: '24 / 30',
      status: '진행중',
      percentage: (24 / 30) * 100,
      details: [
        { name: '글쓰기', grade: 'P' },
        { name: '영어회화', grade: 'A0' }
      ]
    },
    {title : '창업교과목',progress: '3 / 3', status: '완료', percentage: 100,details:[{name:'창업기초', grade:'A+'}]},
    { title: '해외 대학 인정학점', progress: '0 학점', status: '미완료', percentage: 0 },
    { title: '현장실습', progress: '3 학점', status: '완료', percentage: 100 }
  ],
  bsMs: [
    {
      title: '전공학점',
      progress: '31 / 60',
      status: '진행중',
      percentage: (31 / 60) * 100,
      details: [
        { name: '고급알고리즘', grade: 'A+' },
        { name: '프로그래밍기초', grade: 'A0' },
        { name: '데이터베이스', grade: 'B+' },
        { name: '인공지능', grade: 'A0' },
        { name: '소프트웨어공학', grade: 'B0' }
      ]
    },
    {
      title:'현장실습',progress: '3 학점', status: '완료', percentage: 100, details:[{name:'인턴십', grade:'P'}]
    },
    { title: '교양과목', progress: '15 / 30', status: '미완료', percentage: 50, details:[{name:'비판적사고', grade:'A0'},{name:'대학수학', grade:'B+'}] },
    {title:'해외대학 인정학점', progress: '0 학점', status: '미완료', percentage: 0}
  ],
  dualDegree: [
    {
      title: '전공학점',
      progress: '31 / 60',
      status: '진행중',
      percentage: (31 / 60) * 100,
      details: [
        { name: '자료구조', grade: 'A+' },
        { name: '운영체제', grade: 'A0' },
        { name: '컴퓨터네트워크', grade: 'B+' }
      ]
    },
   {title : '창업교과목',progress: '3 / 3', status: '완료', percentage: 100},
    { title: '해외 복수학위 1년 이수', progress: '1 / 1', status: '완료', percentage: 100 },
    { title: '교양과목', progress: '24 / 30', status: '진행중', percentage: (24 / 30) * 100 },
  ]
};

// ----------------------------------------------------------------------
// 체크리스트 페이지 컴포넌트
// ----------------------------------------------------------------------
const ChecklistPage: React.FC = () => {
  // 트랙 상태 관리
  const [selectedTrack, setSelectedTrack] = useState('multiMajor');
  const requirements = REQUIREMENTS_BY_TRACK[selectedTrack];

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
          <p className="text-lg text-pink-500 mt-1 flex items-center">
            세부 트랙 :
            <select
              className="ml-2 p-2 border rounded font-semibold text-gray-700"
              value={selectedTrack}
              onChange={e => setSelectedTrack(e.target.value)}
            >
              {TRACK_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
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
              {...req}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ChecklistPage;

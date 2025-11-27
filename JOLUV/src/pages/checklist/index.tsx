import React, { useState } from 'react';

// RequirementRowProps 인터페이스
interface RequirementRowProps {
  title: string;
  progress: string;
  status: '완료' | '진행중' | '미완료';
  percentage: number;
  details?: { name: string; grade: string }[];
  description?: string;
}

// RequirementRow 컴포넌트
const RequirementRow: React.FC<RequirementRowProps> = ({
  title,
  progress,
  status,
  percentage,
  details,
  description
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
    if (details || description) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div
      className={`p-4 border-b ${details || description ? 'hover:bg-gray-50 cursor-pointer' : ''} transition-colors`}
      onClick={handleToggle}
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        <div className="flex-1 mb-4 sm:mb-0">
          <span className="text-lg font-semibold text-gray-800">{title}</span>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-pink-400 h-2.5 rounded-full"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-end sm:ml-6">
          <span className="text-gray-600 sm:mb-1">{progress}</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge()} sm:ml-0 ml-4`}
          >
            {status}
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-gray-600">
          {description && (
            <div className="mb-3 text-sm bg-gray-50 p-3 rounded whitespace-pre-line">
              {description}
            </div>
          )}
          {details && (
            <>
              <h4 className="font-semibold text-gray-700 mb-2">수강 내역:</h4>
              <ul className="list-disc list-inside space-y-1 pl-2">
                {details.map((course, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{course.name}</span> ({course.grade})
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// 전공 옵션
const MAJOR_OPTIONS = [
  { value: 'globalSW', label: '글로벌SW융합전공' },
  { value: 'advancedComputing', label: '심화컴퓨팅전공' },
  { value: 'aiComputing', label: '인공지능컴퓨팅전공' }
];

// 글로벌SW 트랙 옵션
const GLOBAL_SW_TRACKS = [
  { value: 'multiMajor_minor', label: '다중전공 트랙 - 부전공' },
  { value: 'multiMajor_double', label: '다중전공 트랙 - 복수전공' },
  { value: 'multiMajor_convergence', label: '다중전공 트랙 - 융합전공' },
  { value: 'bsMs', label: '학-석사연계 트랙' },
  { value: 'dualDegree', label: '해외복수학위 트랙' },
];

// 트랙별 졸업요건 데이터
const REQUIREMENTS_BY_TRACK: Record<string, RequirementRowProps[]> = {
  // 1. 다중전공 - 부전공
  multiMajor_minor: [
    { 
      title: '졸업 학점 (총 이수)',
      progress: '90 / 130',
      status: '진행중',
      percentage: (90 / 130) * 100,
      description: '졸업에 필요한 총 학점 (전공 + 교양 + 일반선택 등 포함)'
    },
    {
      title: '전공학점 (부전공)',
      progress: '31 / 60',
      status: '진행중',
      percentage: (31 / 60) * 100,
      description: '주전공(글로벌SW) 60학점 이상 이수 + 타전공 부전공 이수 (21학점 이상)',
      details: [{ name: '자료구조', grade: 'A+' }, { name: '운영체제', grade: 'A0' }]
    },
    { title: '부전공 이수', progress: '0 / 21', status: '미완료', percentage: 0 },
    { title: '교양과목', progress: '24 / 30', status: '진행중', percentage: 80 },
    { title: '현장실습', progress: '3 / 3', status: '완료', percentage: 100 },
  ],

  // 2. 다중전공 - 복수전공
  multiMajor_double: [
    { 
      title: '졸업 학점 (총 이수)',
      progress: '90 / 130',
      status: '진행중',
      percentage: (90 / 130) * 100,
      description: '졸업에 필요한 총 학점'
    },
    {
      title: '전공학점 (복수전공)',
      progress: '31 / 42',
      status: '진행중',
      percentage: (31 / 42) * 100,
      description: '주전공(글로벌SW) 42학점 이상 이수 + 타전공 복수전공 이수 (36학점 이상)',
      details: [{ name: '자료구조', grade: 'A+' }, { name: '운영체제', grade: 'A0' }]
    },
    { title: '복수전공 이수', progress: '12 / 36', status: '진행중', percentage: (12 / 36) * 100 },
    { title: '교양과목', progress: '24 / 30', status: '진행중', percentage: 80 },
  ],

  // 3. 다중전공 - 융합전공
  multiMajor_convergence: [
    { 
      title: '졸업 학점 (총 이수)',
      progress: '90 / 130',
      status: '진행중',
      percentage: (90 / 130) * 100,
      description: '졸업에 필요한 총 학점'
    },
    {
      title: '전공학점 (융합전공)',
      progress: '31 / 42', 
      status: '진행중',
      percentage: (31 / 42) * 100,
      description: '주전공(글로벌SW) 42학점 이상 이수 + 융합전공 이수 (36학점 이상)',
      details: [{ name: '자료구조', grade: 'A+' }, { name: '운영체제', grade: 'A0' }]
    },
    { title: '융합전공 이수', progress: '12 / 36', status: '진행중', percentage: (12 / 36) * 100 },
    { title: '교양과목', progress: '24 / 30', status: '진행중', percentage: 80 },
    { title: '현장실습', progress: '3 / 3', status: '완료', percentage: 100 },
  ],

  // 4. 학-석사연계 트랙
  bsMs: [
    { 
      title: '졸업 학점 (총 이수)',
      progress: '90 / 130',
      status: '진행중',
      percentage: (90 / 130) * 100,
      description: '졸업에 필요한 총 학점'
    },
    {
      title: '전공학점',
      progress: '31 / 60',
      status: '진행중',
      percentage: (31 / 60) * 100,
      description: '학-석사 연계과정: 대학원 과목 6학점 이상 포함하여 전공 60학점 이수',
    },
    { title: '대학원 과목 이수', progress: '0 / 6', status: '미완료', percentage: 0 },
    { title: '현장실습', progress: '3 / 3', status: '완료', percentage: 100 },
  ],

  // 5. 해외복수학위 트랙
  dualDegree: [
    { 
      title: '졸업 학점 (총 이수)',
      progress: '90 / 130',
      status: '진행중',
      percentage: (90 / 130) * 100,
      description: '졸업에 필요한 총 학점'
    },
    {
      title: '전공학점',
      progress: '31 / 60',
      status: '진행중',
      percentage: (31 / 60) * 100,
      description: '본교 2년 + 해외대학 2년 이수. 본교 전공 60학점 이상 인정 필요.',
    },
    { title: '해외 복수학위 1년 이수', progress: '1 / 1', status: '완료', percentage: 100 },
    { title: '교양과목', progress: '24 / 30', status: '진행중', percentage: 80 },
  ],
  
  // 👇 심화컴퓨팅전공 (ABEEK 요건으로 변경됨)
  advancedComputing: [
    {
      title: 'ABEEK 기본소양 (교양)',
      progress: '18 / 25', // 예시 데이터
      status: '진행중',
      percentage: (18 / 25) * 100,
      description: '기본소양(교양) 25학점 이상 이수',
      details: [{ name: '글쓰기', grade: 'A0' }, { name: '실용영어', grade: 'P' }]
    },
    {
      title: 'ABEEK 전공기반 (MSC)',
      progress: '20 / 30', 
      status: '진행중',
      percentage: (20 / 30) * 100,
      description: '수학, 기초과학, 전산학 등 전공기반(MSC) 30학점 이상 이수',
      details: [{ name: '일반물리학', grade: 'B+' }, { name: '미적분학', grade: 'A0' }]
    },
    {
      title: 'ABEEK 공학전공',
      progress: '45 / 60',
      status: '진행중',
      percentage: (45 / 60) * 100,
      description: '공학전공 60학점 이상 이수 (설계학점 포함)',
      details: [{ name: '자료구조', grade: 'A+' }, { name: '알고리즘', grade: 'A0' }]
    },
    {
      title: 'ABEEK 총점',
      progress: '83 / 120',
      status: '진행중',
      percentage: (83 / 120) * 100,
      description: 'ABEEK 졸업 요구 총점 충족 여부'
    },
    {
      title: '현장실습',
      progress: '3 / 3',
      status: '완료',
      percentage: 100,
      description: '현장실습 3학점 이상 이수',
      details: [{ name: '하계현장실습', grade: 'S' }]
    }
  ], // <--- 여기가 수정된 부분입니다 (콤마 추가)

  aiComputing : [
    {
      title: '전체 졸업 학점',
      progress: '18 / 140', // 예시 데이터
      status: '진행중',
      percentage: (18 / 25) * 100,
      description: '기본소양(교양) 25학점 이상 이수',
      details: [{ name: '글쓰기', grade: 'A0' }, { name: '실용영어', grade: 'P' }]
    },
    {
      title: '현장실습',
      progress: '3 / 3',
      status: '완료',
      percentage: 100,
      description: '현장실습 3학점 이상 이수',
      details: [{ name: '하계현장실습', grade: 'S' }]
    }
  ]
};


const ChecklistPage: React.FC = () => {
  const [selectedMajor, setSelectedMajor] = useState('globalSW');
  const [selectedTrack, setSelectedTrack] = useState('multiMajor_minor'); 

  const getRequirements = () => {
    if (selectedMajor === 'globalSW') {
      return REQUIREMENTS_BY_TRACK[selectedTrack] || [];
    } else if (selectedMajor === 'advancedComputing') {
      return REQUIREMENTS_BY_TRACK['advancedComputing'] || [];
    } else if (selectedMajor === 'aiComputing') {
      return REQUIREMENTS_BY_TRACK['aiComputing'] || [];
    }
    return [];
  };

  const requirements = getRequirements();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <section className="flex items-center p-6 bg-white rounded-lg shadow-md mb-8">
        <div className="w-20 h-20 bg-gray-300 rounded-full mr-6"></div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">JOLUV 님</h2>
          <div className="mt-2 flex flex-col space-y-2">
            
            {/* 전공 선택 */}
            <div className="flex items-center">
              <span className="text-lg text-gray-600 mr-2 w-20">전공 :</span>
              <select
                className="p-2 border rounded font-semibold text-gray-700 cursor-pointer hover:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                value={selectedMajor}
                onChange={e => setSelectedMajor(e.target.value)}
              >
                {MAJOR_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* 트랙 선택 (글로벌SW일 때만 보임) */}
            {selectedMajor === 'globalSW' && (
              <div className="flex items-center">
                <span className="text-lg text-gray-600 mr-2 w-20">세부 트랙 :</span>
                <select
                  className="p-2 border rounded font-semibold text-gray-700 cursor-pointer hover:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={selectedTrack}
                  onChange={e => setSelectedTrack(e.target.value)}
                >
                  {GLOBAL_SW_TRACKS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </section>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">졸업 check List</h1>
      
      <section className="bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-t-lg border-b">
          <span className="text-xs font-medium text-gray-500 uppercase">졸업 요건</span>
          <span className="text-xs font-medium text-gray-500 uppercase">진행 현황</span>
        </div>
        <div>
          {requirements.map((req, idx) => (
            <RequirementRow
              key={`${req.title}-${idx}`}
              {...req}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ChecklistPage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ----------------------------------------------------------------------
// 1. 타입 정의 (백엔드 DTO와 일치)
// ----------------------------------------------------------------------

// 백엔드의 CheckItem DTO
interface ApiCheckItem {
  category: string;
  current: number;
  required: number;
  passed: boolean; // Lombok 설정에 따라 JSON에서 isPassed가 아니라 passed로 올 수 있음
  message: string;
}

// 백엔드의 전체 응답 DTO
interface GraduationResult {
  studentName: string;
  major: string;
  totalCredits: number;
  checkList: ApiCheckItem[]; // 세부 요건 리스트
}

// 프론트엔드 UI용 Props 인터페이스
interface RequirementRowProps {
  title: string;
  progress: string;
  status: '완료' | '진행중' | '미완료';
  percentage: number;
  details?: { name: string; grade: string }[];
  description?: string;
}

// ----------------------------------------------------------------------
// 2. UI 컴포넌트 (RequirementRow)
// ----------------------------------------------------------------------
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

// ----------------------------------------------------------------------
// 3. 상수 데이터 (옵션)
// ----------------------------------------------------------------------

const MAJOR_OPTIONS = [
  { value: 'globalSW', label: '글로벌SW융합전공' },
  { value: 'advancedComputing', label: '심화컴퓨팅전공/플랫폼SW융합전공' },
  { value: 'aiComputing', label: '인공지능컴퓨팅전공' }
];

const GLOBAL_SW_TRACKS = [
  { value: 'multiMajor_minor', label: '다중전공 트랙 - 부전공' },
  { value: 'multiMajor_double', label: '다중전공 트랙 - 복수전공' },
  { value: 'multiMajor_convergence', label: '다중전공 트랙 - 융합전공' },
  { value: 'bsMs', label: '학-석사연계 트랙' },
  { value: 'dualDegree', label: '해외복수학위 트랙' },
];

// ----------------------------------------------------------------------
// 4. 테스트용 데이터 (학번 리스트)
// ----------------------------------------------------------------------
const TEST_STUDENT_IDS = Array.from({ length: 8 }, (_, i) => `202400000${i + 1}`);

// ----------------------------------------------------------------------
// 5. 메인 페이지 컴포넌트
// ----------------------------------------------------------------------

const ChecklistPage: React.FC = () => {
  // 상태 관리
  const [selectedMajor, setSelectedMajor] = useState('globalSW');
  const [selectedTrack, setSelectedTrack] = useState('multiMajor_minor'); 
  
  // ⭐️ 테스트용 학번 상태 추가
  const [testStudentId, setTestStudentId] = useState('2024000001');

  // 데이터 상태
  const [checklist, setChecklist] = useState<RequirementRowProps[]>([]);
  const [studentName, setStudentName] = useState('JOLUV'); // 기본값
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // API 데이터 가져오기
  useEffect(() => {
    const fetchGraduationRequirements = async () => {
      setLoading(true);
      setErrorMsg(null); // 에러 초기화

      try {
        // 실제 백엔드 API 호출
        // URL과 파라미터는 백엔드 스펙에 맞춰 조정하세요.
        const response = await axios.get<GraduationResult>('/api/graduation/check', {
          params: {
            studentId: testStudentId, // ⭐️ 선택된 테스트 학번 전송
            major: selectedMajor,
            track: selectedMajor === 'globalSW' ? selectedTrack : undefined,
            // sessionId: sessionStorage.getItem("sessionId") // 실제 로그인 시엔 이것도 필요할 수 있음
          },
          headers: {
            'Content-Type': 'application/json',
          }
        });

        // 응답 데이터 처리
        if (response.data) {
          setStudentName(response.data.studentName || '학생');
          
          if (response.data.checkList) {
            // 백엔드 DTO(ApiCheckItem) -> 프론트엔드 Props(RequirementRowProps) 변환
            const mappedData: RequirementRowProps[] = response.data.checkList.map((item) => {
              // 퍼센트 계산 (0으로 나누기 방지)
              const percent = item.required > 0 
                  ? Math.min((item.current / item.required) * 100, 100) 
                  : (item.passed ? 100 : 0);

              return {
                title: item.category,
                progress: `${item.current} / ${item.required}`,
                status: item.passed ? '완료' : (percent > 0 ? '진행중' : '미완료'),
                percentage: percent,
                description: item.message,
                // details: item.details // 만약 백엔드에서 세부 과목도 준다면 여기에 매핑
              };
            });
            setChecklist(mappedData);
          } else {
            setChecklist([]);
          }
        }

      } catch (error: any) {
        console.error("졸업 요건 조회 실패:", error);
        
        let message = "데이터를 불러오지 못했습니다.";
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 409) {
                message = "해당 전공/트랙과 일치하지 않는 학번이거나 데이터가 없습니다.";
            } else if (error.response?.status === 400) {
                message = "잘못된 요청입니다.";
            } else if (error.code === "ERR_NETWORK") {
                message = "서버와 연결할 수 없습니다.";
            }
        }
        setErrorMsg(message);
        setChecklist([]); // 에러 시 리스트 초기화

      } finally {
        setLoading(false);
      }
    };

    fetchGraduationRequirements();
  }, [selectedMajor, selectedTrack, testStudentId]); // ⭐️ 학번이 바뀌어도 재호출

  return (
    <div className="p-8 max-w-7xl mx-auto">
      
      {/* 🔹 테스트용 컨트롤 패널 (개발 중에만 사용) */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8">
        <h3 className="text-blue-800 font-bold mb-2">🔧 [Developer Mode] 테스트 학번 선택</h3>
        <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Test Student ID:</span>
            <select
                className="p-2 border rounded bg-white font-mono text-sm"
                value={testStudentId}
                onChange={(e) => setTestStudentId(e.target.value)}
            >
                {TEST_STUDENT_IDS.map(id => (
                    <option key={id} value={id}>{id}</option>
                ))}
            </select>
            <span className="text-xs text-gray-500 ml-2">
                * 학번을 변경하면 API가 자동으로 호출됩니다.
            </span>
        </div>
      </div>

      <section className="flex items-center p-6 bg-white rounded-lg shadow-md mb-8">
        <div className="w-20 h-20 bg-gray-300 rounded-full mr-6 flex items-center justify-center text-2xl">
           🎓
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {loading ? '로딩중...' : `${studentName} 님`}
          </h2>
          <div className="text-sm text-gray-500 mb-2">학번: {testStudentId}</div>
          
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

      <h1 className="text-3xl font-bold text-gray-800 mb-6">졸업 Check List</h1>
      
      <section className="bg-white rounded-lg shadow-md min-h-[300px]">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-t-lg border-b">
          <span className="text-xs font-medium text-gray-500 uppercase">졸업 요건</span>
          <span className="text-xs font-medium text-gray-500 uppercase">진행 현황</span>
        </div>
        
        {/* 로딩, 에러, 데이터 상태 처리 */}
        {loading ? (
           <div className="flex justify-center items-center h-40 text-gray-500">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mr-2"></div>
               데이터를 분석하고 있습니다...
           </div>
        ) : errorMsg ? (
            <div className="p-10 text-center">
                <div className="text-red-500 font-bold mb-2">⚠️ 조회 실패</div>
                <div className="text-gray-600">{errorMsg}</div>
                <div className="text-sm text-gray-400 mt-2">선택한 전공/트랙이 학생의 실제 데이터와 맞는지 확인해주세요.</div>
            </div>
        ) : checklist.length > 0 ? (
            <div>
              {checklist.map((req, idx) => (
                <RequirementRow
                  key={`${req.title}-${idx}`}
                  {...req}
                />
              ))}
            </div>
        ) : (
            <div className="p-8 text-center text-gray-500">
                표시할 졸업 요건 데이터가 없습니다.
            </div>
        )}
      </section>
    </div>
  );
};

export default ChecklistPage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ----------------------------------------------------------------------
// 1. 타입 정의 (백엔드 DTO와 일치)
// ----------------------------------------------------------------------

interface ApiCheckItem {
    category: string;
    current: number;
    required: number;
    passed: boolean;
    message: string;
}

interface GraduationResponse {
    majorType: string;
    studentId: number;
    graduationPossible: boolean;
    checkList: ApiCheckItem[];
    missingCourses: string[];
}

interface RequirementRowProps {
    title: string;
    progress: string;
    status: '완료' | '미완료';
    percentage: number;
    message: string;
}

// ----------------------------------------------------------------------
// 2. RequirementRow 컴포넌트
// ----------------------------------------------------------------------
const RequirementRow: React.FC<RequirementRowProps> = ({
                                                           title,
                                                           progress,
                                                           status,
                                                           percentage,
                                                           message
                                                       }) => {
    const getStatusBadge = () => {
        return status === '완료'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700';
    };

    return (
        <div className="p-4 border-b hover:bg-gray-50 transition-colors">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <div className="flex-1 mb-4 sm:mb-0 mr-4">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-lg font-semibold text-gray-800">{title}</span>
                        <span className="text-sm text-gray-500">{progress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className={`h-2.5 rounded-full ${status === '완료' ? 'bg-green-500' : 'bg-pink-400'}`}
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{message}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge()}`}>
                    {status}
                  </span>
                </div>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// 3. 메인 페이지 컴포넌트
// ----------------------------------------------------------------------
const ChecklistPage: React.FC = () => {
    const [data, setData] = useState<GraduationResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get<GraduationResponse>(`/api/graduation/my-status`);
                setData(response.data);
            } catch (err) {
                console.error(err);
                setError("데이터를 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center">로딩 중...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!data) return null;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* 1. 프로필 섹션 */}
            <section className="flex items-center p-6 bg-white rounded-lg shadow-md mb-8 border-l-4 border-pink-500">
                <div className="w-16 h-16 bg-gray-200 rounded-full mr-6 flex items-center justify-center text-2xl">
                    🎓
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{data.studentId} 님</h2>
                    <p className="text-gray-600">
                        판정된 전공 트랙: <span className="font-bold text-indigo-600">{data.majorType}</span>
                    </p>
                    <p className={`font-semibold mt-1 ${data.graduationPossible ? 'text-green-600' : 'text-red-500'}`}>
                        {data.graduationPossible ? "🎉 졸업 가능합니다!" : "⚠️ 아직 부족한 요건이 있습니다."}
                    </p>
                </div>
            </section>

            {/* 2. 요건 리스트 섹션 (위로 이동됨) */}
            <h1 className="text-2xl font-bold text-gray-800 mb-4">졸업 요건 상세 점검</h1>
            <section className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
                    <span className="text-xs font-medium text-gray-500 uppercase">체크 항목</span>
                    <span className="text-xs font-medium text-gray-500 uppercase">상태</span>
                </div>
                <div>
                    {data.checkList.map((item, index) => {
                        const percent = item.required > 0
                            ? Math.min((item.current / item.required) * 100, 100)
                            : (item.passed ? 100 : 0);

                        return (
                            <RequirementRow
                                key={index}
                                title={item.category}
                                progress={`${item.current} / ${item.required}`}
                                status={item.passed ? '완료' : '미완료'}
                                percentage={percent}
                                message={item.message}
                            />
                        );
                    })}
                </div>
            </section>

            {/* 3. 미이수 필수 과목 경고창 (아래로 이동됨) */}
            {data.missingCourses && data.missingCourses.length > 0 && (
                <section className="bg-red-50 border border-red-200 rounded-lg p-4 mt-8"> {/* mt-8 추가하여 윗 요소와 간격 확보 */}
                    <h3 className="text-red-700 font-bold text-lg mb-2">🚨 미이수 필수 과목</h3>
                    <ul className="list-disc list-inside text-red-600 space-y-1">
                        {data.missingCourses.map((course, idx) => (
                            <li key={idx}>{course}</li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
};

export default ChecklistPage;
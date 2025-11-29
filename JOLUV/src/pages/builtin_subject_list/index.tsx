import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SubjectCard from './components/SubjectCard';

// 스타일은 Tailwind CSS 클래스를 사용하여 버튼을 꾸밉니다.
import './index.css';

type SortType = 'name' | 'grade' | 'credit';
type SemesterLabel = '1학기' | '2학기' | '계절학기';
type FilterCategory = '전체' | '전공' | '교양'; 

interface Subject {
  id: number;
  name: string;
  credit: number;
  grade: string;        // 표시용 등급 (A+, B0 ...)
  score: number;        // ⭐️ [추가] 정렬용 원본 점수 (4.3, 3.0 ...)
  category: string;
  needsRetake: boolean;
  year: number;
  semester: SemesterLabel;
}

interface HistoryApiItem {
  lecid: string;
  lectureName: string;
  credit: number;
  received_grade: number;
  lecType: string;
  grade: number;
  semester: number;
}

const toSemesterLabel = (sem: number): SemesterLabel => {
  if (sem === 1) return '1학기';
  if (sem === 2) return '2학기';
  return '계절학기';
};

// ⭐️ [추가] 점수를 등급으로 변환하는 함수
const convertScoreToGrade = (score: number): string => {
  if (score >= 4.3) return 'A+';
  if (score >= 4.0) return 'A0';
  if (score >= 3.7) return 'A-';
  if (score >= 3.3) return 'B+';
  if (score >= 3.0) return 'B0';
  if (score >= 2.7) return 'B-';
  if (score >= 2.4) return 'C+';
  if (score >= 2.0) return 'C0';
  if (score >= 1.7) return 'C-';
  if (score >= 1.3) return 'D+';
  if (score >= 1.0) return 'D0';
  return 'F';
};

const Builtin: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('전체');
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortType, setSortType] = useState<SortType>('name');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get<HistoryApiItem[]>('/api/course/history', {
            withCredentials: true 
        });

        const mapped: Subject[] = res.data.map((item, idx) => {
          const point = item.received_grade;
          const needsRetake = (point <= 2.7);
          return {
            id: idx,
            name: item.lectureName,
            credit: item.credit,
            grade: convertScoreToGrade(item.received_grade), // ⭐️ 변환 함수 적용
            score: item.received_grade, // ⭐️ 정렬을 위해 원본 점수 저장
            category: item.lecType,
            needsRetake,
            year: item.grade,
            semester: toSemesterLabel(item.semester),
          };
        });

        setSubjects(mapped);
      } catch (e) {
        console.error(e);
        setError('수강 이력 불러오기 실패');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSort = () => {
    setSubjects(prev => {
      const copied = [...prev];
      if (sortType === 'name') {
        copied.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortType === 'grade') {
        // ⭐️ [수정] 문자열(A+) 대신 숫자(score)로 정렬하여 정확도 보장
        copied.sort((a, b) => b.score - a.score); 
      } else if (sortType === 'credit') {
        copied.sort((a, b) => b.credit - a.credit);
      }
      return copied;
    });
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true; 

    if (selectedCategory === '전공') {
      matchesCategory = subject.category.includes('전공');
    } else if (selectedCategory === '교양') {
      matchesCategory = !subject.category.includes('전공');
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full h-full">
      <header className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        
        <div className="flex bg-gray-100 p-1 rounded-full">
            <button
                onClick={() => setSelectedCategory('전체')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                    selectedCategory === '전체'
                        ? 'bg-pink-500 text-white shadow-md'
                        : 'text-gray-500 hover:bg-gray-200'
                }`}
            >
                전체
            </button>
            <button
                onClick={() => setSelectedCategory('전공')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                    selectedCategory === '전공'
                        ? 'bg-pink-500 text-white shadow-md'
                        : 'text-gray-500 hover:bg-gray-200'
                }`}
            >
                전공
            </button>
            <button
                onClick={() => setSelectedCategory('교양')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                    selectedCategory === '교양'
                        ? 'bg-pink-500 text-white shadow-md'
                        : 'text-gray-500 hover:bg-gray-200'
                }`}
            >
                교양
            </button>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
            <input
            type="text"
            placeholder="과목명 검색..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-400 flex-grow"
            />

            <select
            value={sortType}
            onChange={e => setSortType(e.target.value as SortType)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-400 bg-white"
            >
            <option value="name">이름순</option>
            <option value="grade">성적순</option>
            <option value="credit">학점순</option>
            </select>

            <button 
                onClick={handleSort}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm whitespace-nowrap"
            >
            정렬
            </button>
        </div>
      </header>

      {loading && <div className="text-center py-10 text-gray-500">데이터를 불러오는 중...</div>}
      {error && <div className="text-center py-10 text-red-500 font-bold">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
        {filteredSubjects.length === 0 && !loading && !error ? (
            <div className="col-span-full text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300 w-full">
                해당하는 과목이 없습니다.
            </div>
        ) : (
            filteredSubjects.map(subject => (
                <SubjectCard key={subject.id} subject={subject} />
            ))
        )}
      </div>
    </div>
  );
};

export default Builtin;
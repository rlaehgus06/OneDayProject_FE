import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SubjectCard from './components/SubjectCard';

import './index.css';

type SortType = 'name' | 'grade' | 'credit';
type SemesterLabel = '1학기' | '2학기' | '계절학기';
type GradeLabel = '1학년' | '2학년' | '3학년' | '4학년';

interface Subject {
  id: number;
  name: string;
  credit: number;
  grade: number;        // 성적 (A0, B+ ...)
  category: string;
  needsRetake: boolean;
  year: number;         // 학년 (1~4)
  semester: SemesterLabel;
}

interface HistoryApiItem {
  lecid: string;
  lectureName: string;
  credit: number;
  received_grade: number;
  lecType: string;
  grade: number;        // 백엔드에서 학년 (1~4)
  semester: number;     // 1,2,3(계절) 등
}

// 성적을 숫자로 매핑해서 B0 이하인지 판단
const gradeToPoint = (grade: string): number => {
  const map: Record<string, number> = {
    'A+': 4.3,
    'A0': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B0': 3.0,
    'B-': 2.7,
    'C+': 2.4,
    'C0': 2.0,
    'C-': 1.7,
    'D+': 1.3,
    'D0': 1.0,
    'F': 0,
    'P': 5,   // 패스는 재이수 X라고 보고 높게
    'NP': 0,
  };
  return map[grade] ?? 0;
};

const toSemesterLabel = (sem: number): SemesterLabel => {
  if (sem === 1) return '1학기';
  if (sem === 2) return '2학기';
  return '계절학기';
};

const toGradeLabel = (grade: number): GradeLabel => {
  if (grade === 1) return '1학년';
  if (grade === 2) return '2학년';
  if (grade === 3) return '3학년';
  return '4학년';
};

const Builtin: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLabel>('1학년');
  const [selectedSemester, setSelectedSemester] = useState<SemesterLabel>('1학기');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortType, setSortType] = useState<SortType>('name');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // /api/course/history 에서 데이터 가져오기 (학년/학기 파라미터 포함)
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const gradeNumber =
          selectedGrade === '1학년' ? 1 :
          selectedGrade === '2학년' ? 2 :
          selectedGrade === '3학년' ? 3 : 4;

        const semesterNumber =
          selectedSemester === '1학기' ? 1 :
          selectedSemester === '2학기' ? 2 : 3;

        const res = await axios.get<HistoryApiItem[]>('/api/course/history', {
          params: {
            grade: gradeNumber,
            semester: semesterNumber,
          },
        });

        const mapped: Subject[] = res.data.map((item, idx) => {
          const point = item.received_grade;
          const needsRetake =  (point <= 2.7);
          return {
            id: idx,
            name: item.lectureName,
            credit: item.credit,
            grade: item.received_grade,
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
  }, [selectedGrade, selectedSemester]);

  const handleGradeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGrade(event.target.value as GradeLabel);
  };

  const handleSemesterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemester(event.target.value as SemesterLabel);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSort = () => {
    setSubjects(prev => {
      const copied = [...prev];
      if (sortType === 'name') {
        copied.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortType === 'grade') {
        copied.sort((a, b) => gradeToPoint(b.grade) - gradeToPoint(a.grade));
      } else if (sortType === 'credit') {
        copied.sort((a, b) => b.credit - a.credit);
      }
      return copied;
    });
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <header className="header">
        {/* 학년 선택 */}
        <select value={selectedGrade} onChange={handleGradeChange}>
          <option value="1학년">1학년</option>
          <option value="2학년">2학년</option>
          <option value="3학년">3학년</option>
          <option value="4학년">4학년</option>
        </select>

        {/* 학기 선택 */}
        <select value={selectedSemester} onChange={handleSemesterChange}>
          <option value="1학기">1학기</option>
          <option value="2학기">2학기</option>
          <option value="계절학기">계절학기</option>
        </select>

        {/* 과목명 검색 */}
        <input
          type="text"
          placeholder="과목명 검색"
          value={searchQuery}
          onChange={handleSearchChange}
        />

        {/* 정렬 기준 선택 */}
        <select
          value={sortType}
          onChange={e => setSortType(e.target.value as SortType)}
        >
          <option value="name">이름순</option>
          <option value="grade">성적순</option>
          <option value="credit">학점순</option>
        </select>

        <button onClick={handleSort}>정렬</button>
      </header>

      {loading && <p>불러오는 중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="cards-container">
        {filteredSubjects.map(subject => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  );
};

export default Builtin;

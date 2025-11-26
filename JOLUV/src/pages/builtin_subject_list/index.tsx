
import React, { useState } from 'react';
import SubjectCard from './components/SubjectCard';
import type { Subject, SortType, Semester } from './types';

import './index.css';

const Builtin: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState<Semester>('1학기');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortType, setSortType] = useState<SortType>('name');

  const subjects: Subject[] = [
    {
      id: 1,
      name: '자료구조',
      credit: 3,
      grade: 'A+',
      isCompulsory: true,
      needsRetake: false
    },
    {
      id: 2,
      name: '알고리즘',
      credit: 3,
      grade: 'C+',
      isCompulsory: true,
      needsRetake: true
    },
    {
      id: 3,
      name: '운영체제',
      credit: 3,
      grade: 'B0',
      isCompulsory: true,
      needsRetake: false
    }
  ];

  const handleSemesterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemester(event.target.value as Semester);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSort = () => {
    // 정렬 로직 구현
    console.log(`Sorting by: ${sortType}`);
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <header className="header">
        <select value={selectedSemester} onChange={handleSemesterChange}>
          <option value="1학기">1학기</option>
          <option value="2학기">2학기</option>
          <option value="계절학기">계절학기</option>
        </select>
        <input
          type="text"
          placeholder="과목명 검색"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button onClick={handleSort}>정렬</button>
      </header>
      
      <div className="cards-container">
        {filteredSubjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  );
};

export default Builtin;

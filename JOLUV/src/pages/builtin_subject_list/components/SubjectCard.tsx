import React from 'react';
import type { Subject } from '../types';
import './SubjectCard.css';

interface SubjectCardProps {
  subject: Subject;
}

function gradeToString(grade: number): string {
  const map: Record<number, string> = {
    4.3: 'A+',
    4.0: 'A0',
    3.7: 'A-',
    3.3: 'B+',
    3.0: 'B0',
    2.7: 'B-',
    2.3: 'C+',
    2.0: 'C0',
    1.7: 'C-',
    1.3: 'D+',
    1.0: 'D0',
    0: 'F',
    5: 'P',   // 패스는 재이수 X라고 보고 높게
    0: 'NP',
  };
  return map[grade] ?? 'NP';
}


const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  const { name, credit, grade, category, needsRetake, } = subject;

  return (
    <div className="subject-card">
      <div className="subject-name">{name}</div>

      <div className="subject-meta">
        <span className="subject-credit-pill">{credit}학점</span>
        <span className="subject-grade-pill">성적 {gradeToString(grade)}</span>
      </div>

      <div className="subject-extra">

      </div>

      <div className="button-container">
        <span className="compulsory-btn">{category}</span>
        {needsRetake && <span className="retake-btn">재수강 필요</span>}
      </div>
    </div>
  );
};

export default SubjectCard;

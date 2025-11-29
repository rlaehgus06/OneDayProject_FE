import React from 'react';
import type { Subject } from '../types';
import './SubjectCard.css';

interface SubjectCardProps {
  subject: Subject;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  const { name, credit, grade, category, needsRetake, year, semester } = subject;

  return (
    <div className="subject-card">
      <div className="subject-name">{name}</div>

      <div className="subject-meta">
        <span className="subject-credit-pill">{credit}학점</span>
        <span className="subject-grade-pill">성적 {grade}</span>
      </div>

      <div className="subject-extra">
        {year}학년 · {semester}
      </div>

      <div className="button-container">
        <span className="compulsory-btn">{category}</span>
        {needsRetake && <span className="retake-btn">재수강 필요</span>}
      </div>
    </div>
  );
};

export default SubjectCard;

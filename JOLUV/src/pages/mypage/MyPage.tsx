// src/pages/MyPage.tsx
import React from 'react';
import './MyPage.css';

interface ChecklistItem {
  title: string;
  progress: number;
  total: number;
  status: string;
}

interface CareerItem {
  type: '대회' | '인턴십';
  title: string;
  sub: string;
  year: string;
}

const checklist: ChecklistItem[] = [
  { title: '전공학점', progress: 31, total: 60, status: '진행중' },
  { title: '부전공', progress: 0, total: 21, status: '미완료' },
  { title: '교양과목', progress: 24, total: 30, status: '진행중' },
];

const careers: CareerItem[] = [
  { type: '대회', title: 'AI 경진대회 3위', sub: '네이버 AI 대회', year: '2025' },
  { type: '인턴십', title: 'KDN 데이터 분석 인턴', sub: '한국데이터넷', year: '2024' },
  // 원하는 경력 추가
];

const MyPage: React.FC = () => {
  return (
    <div className="mypage__layout">
      {/* 좌측 박스 */}
      <div className="mypage__container box__left">
        <header className="mypage__header">
          <div className="profile__img" />
          <div>
            <h1 className="user__name">JOLUV 님</h1>
            <p className="user__info">컴퓨터학부 SW글로벌 융합전공</p>
            <p className="user__track">세부 트랙: <span>다중전공트랙</span></p>
          </div>
        </header>
        <section className="mypage__checklist">
          <h2>졸업 check List</h2>
          <div className="checklist__items">
            {checklist.map((item, idx) => (
              <div className="check__item" key={idx}>
                <div className="item__top">
                  <span className="item__title">{item.title}</span>
                  <span className="item__progress">{item.progress} / {item.total}</span>
                  <span className={`item__status ${item.status === '진행중' ? 'working' : 'notdone'}`}>
                    {item.status}
                  </span>
                </div>
                <div className="item__bar">
                  <div
                    className="item__bar--active"
                    style={{ width: `${(item.progress / item.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      {/* 우측 박스 */}
      <div className="mypage__container box__right">
        <section className="career__section">
          <h2>경력 및 활동</h2>
          <div className="career__list">
            {careers.map((career, idx) => (
              <div className="career__item" key={idx}>
                <span className={`career__badge career__badge--${career.type}`}>
                  {career.type}
                </span>
                <div className="career__info">
                  <div className="career__title">{career.title}</div>
                  <div className="career__sub">{career.sub}</div>
                  <div className="career__year">{career.year}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyPage;

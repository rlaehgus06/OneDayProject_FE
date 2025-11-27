import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyPage.css';

// 사용자 정보 타입 정의
interface UserInfo {
  name: string;      // 여기에 username을 넣을 예정
  major: string;
  track: string;
  profileImage?: string;
}

// (기타 인터페이스 및 더미 데이터 생략 - 기존과 동일하게 유지)
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

const initialCareers: CareerItem[] = [
  { type: '대회', title: 'AI 경진대회 3위', sub: '네이버 AI 대회', year: '2025' },
  { type: '인턴십', title: 'KDN 데이터 분석 인턴', sub: '한국데이터넷', year: '2024' },
];

const MyPage: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [careers, setCareers] = useState<CareerItem[]>(initialCareers);
  const [form, setForm] = useState<CareerItem>({
    type: '대회', title: '', sub: '', year: ''
  });

  // 👇 페이지가 열리자마자 실행되는 부분
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        // 1. 해당 주소로 GET 요청을 보냅니다.
        // (vite.config.ts에 프록시가 설정되어 있다면 '/api/auth/mypage'만 써도 됩니다)
        const response = await axios.get('/api/auth/mypage', {
           // 혹시 토큰이 필요한 경우를 대비해 헤더를 남겨둡니다. 필요 없으면 headers 부분을 지우셔도 됩니다.
           headers: {
             Authorization: `Bearer ${localStorage.getItem('accessToken')}`
           }
        });
        
        console.log('데이터 가져오기 성공:', response.data);

        // 2. 받아온 데이터에서 'username'을 꺼내서 설정합니다.
        setUser({
          name: response.data.username || '이름 없음', // username을 name 자리에 표시
          major: '컴퓨터학부 SW글로벌 융합전공',       // 나머지는 고정값 (또는 받아온 값)
          track: '다중전공트랙',
          profileImage: ''
        });

      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
        // 실패 시 기본값 보여주기 (테스트용)
        setUser({
          name: 'JOLUV (오프라인)',
          major: '컴퓨터학부 SW글로벌 융합전공',
          track: '다중전공트랙',
        });
      }
    };

    fetchUsername();
  }, []);

  // (이하 기존 코드와 동일)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCareer = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.title && form.year) {
      setCareers(prev => [{ ...form }, ...prev]);
      setForm({ type: '대회', title: '', sub: '', year: '' });
    }
  };

  return (
    <div className="mypage__layout">
      <div className="mypage__container box__left">
        <header className="mypage__header">
          <div className="profile__img" />
          <div>
            {/* 👇 받아온 username이 여기에 표시됩니다 */}
            <h1 className="user__name">
              {user ? `${user.name} 님` : '로딩 중...'}
            </h1>
            <p className="user__info">{user?.major}</p>
            <p className="user__track">세부 트랙: <span>{user?.track}</span></p>
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

      <div className="mypage__container box__right">
        <section className="career__section">
          <h2>경력 및 활동</h2>
          <div className="career__list">
            {careers.map((career, idx) => (
              <div className="career__item" key={career.title + career.year + idx}>
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
          <form className="career__form" onSubmit={handleAddCareer}>
            <div className="career__form-row">
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="대회">대회</option>
                <option value="인턴십">인턴십</option>
              </select>
              <input
                name="title"
                type="text"
                placeholder="활동/경력명"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="career__form-row">
              <input
                name="sub"
                type="text"
                placeholder="기관/세부"
                value={form.sub}
                onChange={handleChange}
              />
              <input
                name="year"
                type="text"
                placeholder="연도"
                value={form.year}
                onChange={handleChange}
                required
              />
              <button type="submit">추가</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default MyPage;
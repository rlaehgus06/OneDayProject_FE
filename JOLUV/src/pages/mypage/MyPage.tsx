import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext'; // 👈 AuthContext 사용
import './MyPage.css';

// 사용자 정보 타입 정의
interface UserInfo {
  name: string;      
  user_id: string;
  major: string;
  track: string;
  profileImage?: string;
  studentId?: string; // 학번 추가
}

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

const initialCareers: CareerItem[] = [];

const MyPage: React.FC = () => {
  // ⭐️ Context에서 현재 로그인된 사용자 ID 가져오기
  const { userId } = useAuth();

  const [user, setUser] = useState<UserInfo | null>(null);
  const [careers, setCareers] = useState<CareerItem[]>(initialCareers);
  const [form, setForm] = useState<CareerItem>({
    type: '대회', title: '', sub: '', year: ''
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // ⭐️ [중요 변경] 토큰 헤더 제거 -> 세션 쿠키 사용 (withCredentials: true)
        const response = await axios.get('/api/auth/mypage', { 
            withCredentials: true 
        });
        
        // ----------------------------------------------------------------
        // 백엔드 응답 처리 (HTML 파싱 로직 유지)
        // ----------------------------------------------------------------
        if (typeof response.data === 'string') {
            // 1. HTML 문자열 파싱
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.data, 'text/html');

            // 2. HTML 구조에 맞춰 데이터 추출
            const welcomeP = Array.from(doc.querySelectorAll('p')).find(p => p.textContent?.includes('환영합니다'));
            const name = welcomeP?.querySelector('span')?.textContent || '이름 없음';

            const idSpan = Array.from(doc.querySelectorAll('p')).find(p => p.textContent?.includes('아이디:'))?.querySelector('span');
            const fetchedUserId = idSpan ? idSpan.textContent : '';

            const studentIdSpan = Array.from(doc.querySelectorAll('p')).find(p => p.textContent?.includes('학번:'))?.querySelector('span');
            const studentId = studentIdSpan ? studentIdSpan.textContent : '';

            const majorInput = doc.querySelector('input[name="major"]') as HTMLInputElement;
            const major = majorInput ? majorInput.value : '컴퓨터학부';

            const trackInput = doc.querySelector('input[name="specific_major"]') as HTMLInputElement;
            const track = trackInput ? trackInput.value : '트랙 정보 없음';

            console.log('✅ 추출된 정보:', { name, userId: fetchedUserId, studentId, major, track });

            setUser({
                name: name || '이름 없음',
                user_id: fetchedUserId || userId || '', // API에서 못 찾으면 Context ID 사용
                studentId: studentId || '',
                major: major,
                track: track, 
                profileImage: ''
            });

        } else {
            // JSON 응답일 경우
            setUser({
                name: response.data.name || '이름 없음',
                user_id: response.data.userId || userId || '',
                studentId: response.data.studentId || '',
                major: response.data.major || '컴퓨터학부 SW글로벌 융합전공',
                track: response.data.track || '다중전공트랙',
                profileImage: ''
            });
        }

      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
        // 실패 시 더미 데이터 (Context userId 활용)
        setUser({
          name: 'JOLUV (오프라인)',
          user_id: userId || 'guest',
          studentId: '00000000',
          major: '컴퓨터학부 SW글로벌 융합전공',
          track: '다중전공트랙',
        });
      }
    };

    fetchUserInfo();
  }, [userId]); // userId가 변경되면 재호출

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

  // 트랙 변경 핸들러
  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (user) {
      const newTrack = e.target.value;
      const updatedUser = { ...user, track: newTrack };
      setUser(updatedUser);
      console.log('🔄 사용자 정보 변경됨 (JSON):', JSON.stringify(updatedUser, null, 2));
    }
  };

  return (
    <div className="mypage__layout">
      <div className="mypage__container box__left">
        <header className="mypage__header">
          <div className="profile__img" />
          <div>
            <h1 className="user__name">
              {user ? `${user.name} 님` : '로딩 중...'}
            </h1>
            {/* 학번 표시 */}
            {user?.studentId && (
                <p className="text-sm text-gray-500 mb-1">학번: {user.studentId}</p>
            )}
            <p className="user__info">{user?.major}</p>
            
            {/* 세부 트랙 선택 Dropdown */}
            <p className="user__track flex items-center">
              세부 트랙: 
              {user ? (
                <select 
                  value={user.track} 
                  onChange={handleTrackChange}
                  className="ml-2 p-1 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option value="다중전공트랙">다중전공트랙</option>
                  <option value="학-석사연계트랙">학-석사연계트랙</option>
                  <option value="해외복수학위트랙">해외복수학위트랙</option>
                </select>
              ) : (
                <span className="ml-2">로딩 중...</span>
              )}
            </p>
          </div>
        </header>
        <section className="mypage__checklist">
          <h2>졸업 Check List</h2>
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
            {/* 경력이 없을 때 안내 메시지 표시 */}
            {careers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">등록된 경력 및 활동이 없습니다.</p>
            ) : (
                careers.map((career, idx) => (
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
                ))
            )}
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
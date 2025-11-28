import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import './MyPage.css';

// 사용자 정보 타입 정의
interface UserInfo {
  name: string;      
  user_id: string;
  major: string;
  track: string;
  profileImage?: string;
  studentId?: string; 
  eng_score?: number; 
  internship?: boolean;
}

interface CareerItem {
  type: '대회' | '인턴십';
  title: string;
  sub: string;
  year: string;
}

const initialCareers: CareerItem[] = [];

const MyPage: React.FC = () => {
  const { userId } = useAuth();

  const [user, setUser] = useState<UserInfo | null>(null);
  const [careers, setCareers] = useState<CareerItem[]>(initialCareers);
  const [form, setForm] = useState<CareerItem>({
    type: '대회', title: '', sub: '', year: ''
  });

  const [engScoreInput, setEngScoreInput] = useState<string>('');
  const [internshipChecked, setInternshipChecked] = useState<boolean>(false);
  const [selectedTrack, setSelectedTrack] = useState<string>('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('/api/auth/mypage', { 
            withCredentials: true 
        });
        
        if (typeof response.data === 'string') {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.data, 'text/html');

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
            
            const engInput = doc.querySelector('input[name="eng_score"]') as HTMLInputElement;
            const score = engInput ? parseInt(engInput.value) : 0;

            const internshipInput = doc.querySelector('input[name="internship"]') as HTMLInputElement;
            const isInternship = internshipInput ? internshipInput.checked : false;

            setUser({
                name: name || '이름 없음',
                user_id: fetchedUserId || userId || '',
                studentId: studentId || '',
                major: major,
                track: track, 
                eng_score: score,
                internship: isInternship,
                profileImage: ''
            });
            setEngScoreInput(score.toString());
            setInternshipChecked(isInternship);
            setSelectedTrack(track);

        } else {
            const score = response.data.eng_score || 0;
            const isInternship = response.data.internship || false;
            const track = response.data.track || '다중전공트랙';

            setUser({
                name: response.data.name || '이름 없음',
                user_id: response.data.userId || userId || '',
                studentId: response.data.studentId || '',
                major: response.data.major || '컴퓨터학부 SW글로벌 융합전공',
                track: track,
                eng_score: score,
                internship: isInternship,
                profileImage: ''
            });
            setEngScoreInput(score.toString());
            setInternshipChecked(isInternship);
            setSelectedTrack(track);
        }

      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
        setUser({
          name: 'JOLUV (오프라인)',
          user_id: userId || 'guest',
          studentId: '00000000',
          major: '글로벌소프트웨어융합전공', 
          track: '다중전공트랙',
          eng_score: 0,
          internship: false,
        });
        setEngScoreInput('0');
        setInternshipChecked(false);
        setSelectedTrack('다중전공트랙');
      }
    };

    fetchUserInfo();
  }, [userId]);

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

  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTrack(e.target.value);
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEngScoreInput(e.target.value);
  };

  const handleInternshipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternshipChecked(e.target.checked);
  };

  const handleUpdateInfo = async () => {
    if (!user) return;

    try {
        const formData = new URLSearchParams();
        formData.append('major', user.major);
        formData.append('specific_major', selectedTrack); 
        formData.append('eng_score', engScoreInput);
        formData.append('internship', internshipChecked.toString());
        
        const response = await axios.post('/api/auth/mypage/update', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            withCredentials: true
        });

        if (response.status === 200) {
            alert('정보가 저장되었습니다.');
            setUser({ 
                ...user, 
                track: selectedTrack,
                eng_score: parseInt(engScoreInput) || 0,
                internship: internshipChecked 
            });
        }
    } catch (error) {
        console.error('정보 수정 실패:', error);
        alert('정보 수정 중 오류가 발생했습니다.');
    }
  };

  // ⭐️ [신규 로직] 트랙 선택이 불필요한(고정된) 전공인지 확인
  const isFixedTrack = () => {
    if (!user) return false;
    const majorName = user.major.replace(/\s+/g, '');
    return majorName.includes('심화컴퓨팅전공') || majorName.includes('인공지능컴퓨팅전공');
  };

  // 전공에 따른 트랙 옵션 렌더링 (Global SW 등 선택 가능한 경우에만 사용)
  const renderTrackOptions = () => {
    if (!user) return <option disabled>로딩 중...</option>;
    const majorName = user.major.replace(/\s+/g, '');

    if (majorName.includes('글로벌SW융합전공') || majorName.includes('글로벌소프트웨어융합전공')) {
        return (
            <>
                <option value="다중전공트랙">다중전공트랙</option>
                <option value="해외복수학위트랙">해외복수학위트랙</option>
                <option value="학-석사연계트랙">학-석사연계트랙</option>
            </>
        );
    }
    // 그 외 (기본)
    return (
        <>
            <option value="일반과정">일반과정</option>
            <option value="심화과정">심화과정</option>
        </>
    );
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
            {user?.studentId && (
                <p className="text-sm text-gray-500 mb-1">학번: {user.studentId}</p>
            )}
            <p className="user__info">{user?.major}</p>
          </div>
        </header>

        {/* 1. 세부 트랙 관리 섹션 */}
        <section className="mypage__track-section">
          <h2>세부 트랙 정보</h2>
          <div className="score__content">
            <div className="score__item">
                <label className="score__label track-label">트랙</label>
                
                {/* ⭐️ 조건부 렌더링: 고정 트랙이면 텍스트 표시, 아니면 선택창 표시 */}
                {isFixedTrack() ? (
                    <div className="track__fixed-value">
                        {selectedTrack || user?.major}
                    </div>
                ) : (
                    <select 
                      value={selectedTrack} 
                      onChange={handleTrackChange}
                      className="track__select"
                    >
                      {renderTrackOptions()}
                    </select>
                )}
            </div>
            
            {/* 고정 트랙이 아닐 때만 저장 버튼 표시 (선택권이 있을 때만 저장 필요) */}
            {!isFixedTrack() && (
                <button onClick={handleUpdateInfo} className="score__save-btn secondary">
                    트랙 변경 저장
                </button>
            )}
            
            {/* 고정 트랙일 때 안내 문구 */}
            {isFixedTrack() && (
                <p className="text-xs text-gray-400 mt-2 text-center">
                    * 해당 전공은 단일 트랙으로 운영됩니다.
                </p>
            )}
          </div>
        </section>

        {/* 2. 공인어학성적 관리 섹션 */}
        <section className="mypage__score">
          <h2>공인어학성적 관리</h2>
          <div className="score__content">
            <div className="score__item">
                <label htmlFor="engScore" className="score__label">TOEIC</label>
                <div className="score__input-group">
                    <input 
                        type="number" 
                        id="engScore"
                        value={engScoreInput}
                        onChange={handleScoreChange}
                        placeholder="0"
                        className="score__input"
                    />
                    <span className="score__unit">점</span>
                </div>
            </div>
            <button onClick={handleUpdateInfo} className="score__save-btn secondary">
                성적 저장
            </button>
          </div>
        </section>

        {/* 3. 현장실습 관리 섹션 */}
        <section className="mypage__internship">
          <h2>현장실습 관리</h2>
          <div className="score__content">
            <div className="score__checkbox-row">
                <label htmlFor="internshipCheck" className="checkbox-label">
                    <input 
                        type="checkbox" 
                        id="internshipCheck"
                        checked={internshipChecked}
                        onChange={handleInternshipChange}
                        className="checkbox-input"
                    />
                    <span className="checkbox-text">현장실습(인턴십) 이수 완료</span>
                </label>
            </div>
            <button onClick={handleUpdateInfo} className="score__save-btn secondary">
                실습 여부 저장
            </button>
          </div>
        </section>

      </div>

      <div className="mypage__container box__right">
        <section className="career__section">
          <h2>경력 및 활동</h2>
          <div className="career__list">
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
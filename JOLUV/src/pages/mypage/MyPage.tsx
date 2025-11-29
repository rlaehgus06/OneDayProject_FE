import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import './MyPage.css';

// ----------------------------------------------------------------------
// 1. 타입 정의
// ----------------------------------------------------------------------

interface UserInfo {
  name: string;      
  user_id: string;
  major: string;
  track: string;
  profileImage?: string;
  studentId?: string;
  eng_score?: number;
  totalGpa?: number;
  majorGpa?: number;
  internship?: boolean;
}

interface ActivityItem {
  id?: number;
  user_id?: string;
  category: string;
  title : string;
  detail: string;
  year: string;
}

const MyPage: React.FC = () => {
  const { userId } = useAuth();

  // ----------------------------------------------------------------------
  // 2. State 관리
  // ----------------------------------------------------------------------
  const [user, setUser] = useState<UserInfo | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  
  const [form, setForm] = useState<ActivityItem>({
    category: '대회', title : '', detail: '', year: ''
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ActivityItem>({
    category: '', title: '', detail: '', year: ''
  });

  const [engScoreInput, setEngScoreInput] = useState<string>('');
  const [internshipChecked, setInternshipChecked] = useState<boolean>(false);
  const [selectedTrack, setSelectedTrack] = useState<string>('');
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  // ----------------------------------------------------------------------
  // 3. Helper Functions & Logic
  // ----------------------------------------------------------------------
  
  const showToastMessage = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const fetchActivities = async (studentId: number) => {
      try {
          const response = await axios.get('/api/activity', {
              params: { studentId },
              withCredentials: true
          });
          if (Array.isArray(response.data)) {
              setActivities(response.data);
          }
      } catch (error) {
          console.error("활동 목록 갱신 실패:", error);
      }
  };

  // ⭐️ [로직 추가] 전공에 따라 강제 고정될 트랙명을 반환하는 함수
  const getFixedTrackValue = (majorName: string): string | null => {
      const refinedMajor = majorName.replace(/\s+/g, ''); // 공백 제거 후 비교
      if (refinedMajor.includes('심화컴퓨팅전공')) {
          return '심화컴퓨팅전공트랙';
      }
      if (refinedMajor.includes('인공지능컴퓨팅전공')) {
          return '인공지능트랙';
      }
      return null; // 그 외에는 고정 아님
  };

  // ----------------------------------------------------------------------
  // 4. 초기 데이터 조회 (useEffect)
  // ----------------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get('/api/auth/mypage', { withCredentials: true });
        
        let currentUserStudentId = 0;
        let fetchedUser: UserInfo | null = null;

        if (typeof userRes.data === 'string') {
            // HTML 파싱 (기존 로직 유지)
            const parser = new DOMParser();
            const doc = parser.parseFromString(userRes.data, 'text/html');
            
            const welcomeP = Array.from(doc.querySelectorAll('p')).find(p => p.textContent?.includes('환영합니다'));
            const name = welcomeP?.querySelector('span')?.textContent || '이름 없음';
            const idSpan = Array.from(doc.querySelectorAll('p')).find(p => p.textContent?.includes('아이디:'))?.querySelector('span');
            const fetchedUserId = idSpan ? idSpan.textContent : '';
            const studentIdSpan = Array.from(doc.querySelectorAll('p')).find(p => p.textContent?.includes('학번:'))?.querySelector('span');
            const studentId = studentIdSpan ? studentIdSpan.textContent : '';
            currentUserStudentId = parseInt(studentId || '0');
            const majorInput = doc.querySelector('input[name="major"]') as HTMLInputElement;
            const major = majorInput ? majorInput.value : '컴퓨터학부';
            const trackInput = doc.querySelector('input[name="specific_major"]') as HTMLInputElement;
            const track = trackInput ? trackInput.value : '트랙 정보 없음';
            const engInput = doc.querySelector('input[name="eng_score"]') as HTMLInputElement;
            const score = engInput ? parseInt(engInput.value) : 0;
            const internshipInput = doc.querySelector('input[name="internship"]') as HTMLInputElement;
            const isInternship = internshipInput ? internshipInput.checked : false;

            fetchedUser = {
                name: name || '이름 없음',
                user_id: fetchedUserId || userId || '',
                studentId: studentId || '',
                major: major,
                track: track, 
                eng_score: score,
                totalGpa: 0.0, 
                majorGpa: 0.0,
                internship: isInternship,
                profileImage: ''
            };

        } else {
            // JSON 응답 처리
            const data = userRes.data;
            currentUserStudentId = parseInt(data.studentId || '0');
            fetchedUser = {
                name: data.name || '이름 없음',
                user_id: data.userId || userId || '',
                studentId: data.studentId || '',
                major: data.major || '컴퓨터학부',
                track: data.track || '다중전공트랙',
                eng_score: data.eng_score || 0,
                totalGpa: data.total_gpa || 0.0,
                majorGpa: data.major_gpa || 0.0,
                internship: data.internship || false,
                profileImage: ''
            };
        }

        // 상태 업데이트
        if (fetchedUser) {
            setUser(fetchedUser);
            setEngScoreInput((fetchedUser.eng_score || 0).toString());
            setInternshipChecked(fetchedUser.internship || false);

            // ⭐️ [로직 수정] 전공에 따라 트랙 강제 설정
            const fixedTrack = getFixedTrackValue(fetchedUser.major);
            if (fixedTrack) {
                // 강제 고정 전공이면 무조건 해당 트랙으로 설정
                setSelectedTrack(fixedTrack);
            } else {
                // 아니라면 DB에서 가져온 값 설정
                setSelectedTrack(fetchedUser.track || '다중전공트랙');
            }
        }

        if (currentUserStudentId !== 0) {
            await fetchActivities(currentUserStudentId);
        }

      } catch (error) {
        console.error('데이터 조회 실패:', error);
      }
    };

    fetchData();
  }, [userId]);

  // ----------------------------------------------------------------------
  // 5. 이벤트 핸들러
  // ----------------------------------------------------------------------

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.detail || !form.year) {
        showToastMessage("모든 내용을 입력해주세요 (제목, 내용, 일자).");
        return;
    }
    try {
        const newActivity = {
            category: form.category,
            title: form.title,
            detail: form.detail,
            year: form.year
        };
        const response = await axios.post('/api/activity', newActivity, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        if (response.status === 200 || response.status === 201) {
            showToastMessage('경력이 추가되었습니다! 👍');
            if (user?.studentId) {
                await fetchActivities(parseInt(user.studentId));
            }
            setForm({ category: '대회', title: '', detail: '', year: '' });
        }
    } catch (error) {
        console.error('활동 추가 실패:', error);
        showToastMessage('추가 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id?: number) => {
      if (!id) return;
      if (!window.confirm("정말로 삭제하시겠습니까?")) return;
      try {
          await axios.delete(`/api/activity/${id}`, { withCredentials: true });
          showToastMessage("삭제되었습니다.");
          setActivities(prev => prev.filter(item => item.id !== id));
      } catch (error) {
          console.error("삭제 실패:", error);
          showToastMessage("삭제 중 오류가 발생했습니다.");
      }
  };

  const handleEditClick = (item: ActivityItem) => {
      if (!item.id) return;
      setEditingId(item.id);
      setEditForm({ ...item });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
      if (!editingId) return;
      try {
          const updateData = {
              category: editForm.category,
              title: editForm.title,
              detail: editForm.detail,
              year: editForm.year
          };
          await axios.put(`/api/activity/${editingId}`, updateData, {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true
          });
          showToastMessage("수정되었습니다. ✅");
          setActivities(prev => prev.map(item => 
              item.id === editingId ? { ...item, ...updateData } : item
          ));
          setEditingId(null);
      } catch (error) {
          console.error("수정 실패:", error);
          showToastMessage("수정 중 오류가 발생했습니다.");
      }
  };

  const handleEditCancel = () => {
      setEditingId(null);
  };

  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTrack(e.target.value);
  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => setEngScoreInput(e.target.value);
  const handleInternshipChange = (e: React.ChangeEvent<HTMLInputElement>) => setInternshipChecked(e.target.checked);
  
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
            showToastMessage('정보가 저장되었습니다! 🎉');
            setUser({ ...user, track: selectedTrack, eng_score: parseInt(engScoreInput)||0, internship: internshipChecked });
        }
      } catch(e) { console.error(e); showToastMessage('저장 실패'); }
  };

  // ⭐️ [UI 헬퍼] 현재 유저가 트랙 고정 대상인지 확인
  const isTrackFixed = () => {
      if (!user) return false;
      return getFixedTrackValue(user.major) !== null;
  };

  // ⭐️ [UI 헬퍼] 트랙 옵션 렌더링 (고정된 경우 해당 옵션만 보임)
  const renderTrackOptions = () => { 
    if (!user) return <option disabled>로딩 중...</option>;
    const majorName = user.major.replace(/\s+/g, '');
    
    // 1. 심화컴퓨팅전공 -> 심화컴퓨팅전공트랙 고정
    if (majorName.includes('심화컴퓨팅전공')) {
        return <option value="심화컴퓨팅전공트랙">심화컴퓨팅전공트랙</option>;
    }
    // 2. 인공지능컴퓨팅전공 -> 인공지능트랙 고정
    else if (majorName.includes('인공지능컴퓨팅전공')) {
        return <option value="인공지능트랙">인공지능컴퓨팅전공트랙</option>;
    }
    // 3. 글로벌SW 등 -> 선택 가능
    else if (majorName.includes('글로벌SW융합전공') || majorName.includes('글로벌소프트웨어융합전공')) {
        return (
            <>
                <option value="다중전공트랙">다중전공트랙</option>
                <option value="해외복수학위트랙">해외복수학위트랙</option>
                <option value="학-석사연계트랙">학-석사연계트랙</option>
            </>
        );
    }
    // 4. 그 외(일반 컴퓨터학부 등)
    return (
        <>
            <option value="일반과정">일반과정</option>
            <option value="심화과정">심화과정</option>
        </>
    );
  };

  // ----------------------------------------------------------------------
  // 6. 렌더링
  // ----------------------------------------------------------------------
  return (
    <div className="mypage__layout">
      {toast.show && (
        <div className="toast-notification">
            <span className="toast-icon">✅</span>
            {toast.message}
        </div>
      )}

      <div className="mypage__container box__left">
         <header className="mypage__header">
            <div className="profile__img" />
            <div>
                <h1 className="user__name">{user ? `${user.name} 님` : '...'}</h1>
                {user?.studentId && (
                    <p className="user__info" style={{ marginBottom: '5px', fontWeight: 'bold' }}>
                        학번 : {user.studentId}
                    </p>
                )}
                <p className="user__info">{user?.major}</p>
            </div>
         </header>

         {/* 세부 트랙 정보 */}
         <section className="mypage__track-section">
             <h2>세부 트랙 정보</h2>
             <div className="score__content">
                 <div className="score__item">
                     {/* 고정된 경우 레이블을 조금 다르게 표시하거나 기존 유지 */}
                     <label className="score__label track-label">트랙</label>

                     <select 
                       value={selectedTrack} 
                       onChange={handleTrackChange}
                       className="track__select"
                       // ⭐️ [UI 적용] 트랙이 고정된 경우 비활성화(disabled) 처리
                       disabled={isTrackFixed()}
                       style={isTrackFixed() ? { backgroundColor: '#f0f0f0', color: 'black', cursor: 'not-allowed' } : {}}
                     >
                       {renderTrackOptions()}
                     </select>
                 </div>
                 {/* ⭐️ 트랙이 고정된 경우 저장 버튼 숨김 (필요 없으므로) */}
                 {!isTrackFixed() && (
                    <button onClick={handleUpdateInfo} className="score__save-btn secondary">트랙 저장</button>
                 )}
                 {isTrackFixed() && (
                    <span style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px', display: 'block' }}>
                        ※ 해당 전공은 단일트랙으로 지정됩니다.
                    </span>
                 )}
             </div>
         </section>

         <section className="mypage__score">
             <h2>공인어학성적 관리</h2>
             <div className="score__content">
                 <div className="score__item">
                     <label htmlFor="engScore" className="score__label">TOEIC</label>
                     <div className="score__input-group">
                         <input type="number" id="engScore" value={engScoreInput} onChange={handleScoreChange} placeholder="0" className="score__input" />
                         <span className="score__unit">점</span>
                     </div>
                 </div>
                 <button onClick={handleUpdateInfo} className="score__save-btn secondary">성적 저장</button>
             </div>
         </section>

         <section className="mypage__internship">
             <h2>현장실습 관리</h2>
             <div className="score__content">
                 <div className="score__checkbox-row">
                     <label htmlFor="internshipCheck" className="checkbox-label">
                         <input type="checkbox" id="internshipCheck" checked={internshipChecked} onChange={handleInternshipChange} className="checkbox-input" />
                         <span className="checkbox-text">현장실습(인턴십) 이수 완료</span>
                     </label>
                 </div>
                 <button onClick={handleUpdateInfo} className="score__save-btn secondary">실습 여부 저장</button>
             </div>
         </section>
      </div>

      <div className="mypage__container box__right">
        {/* 학점 현황 */}
        <section className="mypage__gpa">
          <h2>학점 현황</h2>
          <div className="score__content">
            <div className="gpa__container">
              <div className="gpa__item">
                  <span className="gpa__label">전체 학점</span>
                  <div className="gpa__value-wrapper">
                    <span className="gpa__value">{user?.totalGpa?.toFixed(2) || "0.00"}</span>
                    <span className="gpa__max"> / 4.3</span>
                  </div>
              </div>
              <div className="gpa__divider"></div>
              <div className="gpa__item">
                  <span className="gpa__label">전공 학점</span>
                  <div className="gpa__value-wrapper">
                    <span className="gpa__value highlight">{user?.majorGpa?.toFixed(2) || "0.00"}</span>
                    <span className="gpa__max"> / 4.3</span>
                  </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* 경력 및 활동 섹션 */}
        <section className="career__section">
          <h2>경력 및 활동</h2>
          
          <div className="career__list">
            {activities.length === 0 ? (
                <p className="empty-message">등록된 활동이 없습니다.</p>
            ) : (
                activities.map((item, idx) => {
                    const isEditing = editingId === item.id;
                    
                    return (
                        <div className="career__card" key={item.id || idx}>
                            {isEditing ? (
                                <div className="career__edit-form">
                                    <div className="form-row top-row">
                                        <select name="category" value={editForm.category} onChange={handleEditChange} className="custom-select">
                                            <option value="대회">대회</option>
                                            <option value="인턴십">인턴십</option>
                                            <option value="자격증">자격증</option>
                                            <option value="기타">기타</option>
                                        </select>
                                        <input name="year" value={editForm.year} onChange={handleEditChange} className="custom-input year-input" placeholder="일자 (YYYY-MM-DD)" />
                                    </div>
                                    <input name="title" value={editForm.title} onChange={handleEditChange} className="custom-input title-input" placeholder="제목" />
                                    <input name="detail" value={editForm.detail} onChange={handleEditChange} className="custom-input detail-input" placeholder="상세 내용" />
                                    <div className="edit-actions">
                                        <button onClick={handleEditSave} className="btn-save">저장</button>
                                        <button onClick={handleEditCancel} className="btn-cancel">취소</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="career__view">
                                    <div className="view-header">
                                        <span className={`badge badge--${item.category}`}>{item.category}</span>
                                        <span className="view-year">{item.year}</span>
                                    </div>
                                    <div className="view-body">
                                        <h3 className="view-title">{item.title}</h3>
                                        <p className="view-detail">{item.detail}</p>
                                    </div>
                                    <div className="view-actions">
                                        <button onClick={() => handleEditClick(item)} className="icon-btn edit" title="수정">✏️</button>
                                        <button onClick={() => handleDelete(item.id)} className="icon-btn delete" title="삭제">🗑️</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
          </div>

          <hr className="divider" />

          <h3 className="form-title">새 활동 추가</h3>
          <form className="career__add-form" onSubmit={handleAddActivity}>
            <div className="form-row top-row">
              <select name="category" value={form.category} onChange={handleFormChange} className="custom-select">
                <option value="대회">대회</option>
                <option value="인턴십">인턴십</option>
                <option value="자격증">자격증</option>
                <option value="기타">기타</option>
              </select>
              <input name="year" type="text" value={form.year} onChange={handleFormChange} required className="custom-input year-input" placeholder="일자 (예: 2025-03-01)" />
            </div>
            <div className="form-row">
                <input name="title" type="text" placeholder="활동 제목을 입력하세요" value={form.title} onChange={handleFormChange} required className="custom-input title-input" />              
            </div>
            <div className="form-row">
                <input name="detail" type="text" placeholder="상세 내용을 입력하세요 (예: 대상 수상)" value={form.detail} onChange={handleFormChange} required className="custom-input detail-input" />
            </div>
            <button type="submit" className="btn-submit-full">추가하기</button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default MyPage;
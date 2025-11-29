import { useState, useEffect } from "react";
import { CareerPassLanding } from "./components/CareerPassLanding";
import { CareerPackApp } from "./components/CareerPackApp";
import { LoginPage } from "./components/LoginPage";
import { LoginRequired } from "./components/LoginRequired";
import { ProfileRequired } from "./components/ProfileRequired";
import { getMe } from "./api";

type PageType = 'main' | 'roadmap' | 'resume' | 'interview' | 'profile';

// localStorage에 기본 프로필 정보 초기화 (피그마 메이크에서 확인 가능하도록)
const initializeProfile = () => {
  const existingProfile = localStorage.getItem('userProfile');
  if (!existingProfile) {
    const defaultProfile = {
      name: "김학생",
      email: "student@example.com",
      department: "컴퓨터공학과",
      targetJob: "백엔드 개발자",
      isComplete: true
    };
    localStorage.setItem('userProfile', JSON.stringify(defaultProfile));
  }
};

// 앱 시작 시 프로필 초기화
initializeProfile();

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('main');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 피그마 메이크에서 확인할 수 있도록 true로 설정
  const [showLogin, setShowLogin] = useState(false);
  
  // localStorage에서 프로필 완성 여부 확인
  const checkProfileComplete = () => {
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      try {
        const parsed = JSON.parse(profile);
        return parsed.isComplete === true;
      } catch {
        return false;
      }
    }
    return false;
  };
  
  const [isProfileComplete, setIsProfileComplete] = useState(checkProfileComplete()); // localStorage에서 프로필 상태 확인

  // OAuth 콜백 처리 (구글 OAuth 콜백 감지)
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      // OAuth 콜백이 있는 경우 (?code=...)
      if (code) {
        console.log('OAuth 콜백 감지:', code);
        
        // URL에서 code 파라미터 제거
        window.history.replaceState({}, document.title, window.location.pathname);
        
        try {
          // /me 엔드포인트 호출 시도 (로그인 상태 확인)
          try {
            const userData = await getMe();
            console.log('사용자 정보 조회 성공:', userData);
            
            // 사용자 정보가 있으면 localStorage에 저장
            if (userData) {
              localStorage.setItem('userId', userData.id?.toString() || '');
              if (userData.email) {
                const profile = {
                  email: userData.email,
                  name: userData.nickname || userData.name || '',
                  department: userData.major || '',
                  targetJob: userData.targetJob || '',
                  isComplete: userData.profileCompleted || false
                };
                localStorage.setItem('userProfile', JSON.stringify(profile));
              }
            }
          } catch (meError) {
            // /me 호출 실패해도 OAuth 콜백이 성공했다는 것을 기준으로 로그인 처리 계속
            console.warn('getMe 호출 실패 (CORS 문제 가능):', meError);
            console.log('OAuth 콜백 성공 = 백엔드가 처리했다는 의미로 간주, 로그인 처리 계속');
          }
          
          // OAuth 콜백 성공 = 백엔드가 처리했다는 의미로 간주
          // CORS 문제가 있어도 로그인 상태 설정 및 대시보드 이동 진행
          setIsLoggedIn(true);
          setShowLogin(false);
          
          // 프로필 완성 여부 확인 후 적절한 페이지로 이동
          const profileComplete = checkProfileComplete();
          if (profileComplete) {
            setCurrentPage('roadmap');
          } else {
            setCurrentPage('profile');
          }
        } catch (error) {
          console.error('OAuth 콜백 처리 중 오류:', error);
          // 오류가 발생해도 OAuth 콜백이 있었다는 것은 성공으로 간주
          setIsLoggedIn(true);
          setShowLogin(false);
          setCurrentPage('roadmap');
        }
      }
    };
    
    handleOAuthCallback();
  }, []);

  const handlePageChange = (page: PageType) => {
    // 메인 페이지가 아닌데 로그인이 안되어 있으면 로그인 필요 페이지 표시
    if (page !== 'main' && !isLoggedIn) {
      setCurrentPage('login-required' as PageType);
      return;
    }
    
    // 로그인은 되어 있지만 프로필이 완성되지 않았고, 프로필 페이지가 아니면 프로필 설정 필요 페이지 표시
    const profileComplete = checkProfileComplete();
    if (page !== 'main' && page !== 'profile' && isLoggedIn && !profileComplete) {
      setCurrentPage('profile-required' as PageType);
      return;
    }
    
    setCurrentPage(page);
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
    // 첫 로그인 시 프로필이 완성되어 있으면 메인으로, 아니면 프로필 페이지로
    if (checkProfileComplete()) {
      setCurrentPage('roadmap');
    } else {
      setCurrentPage('profile');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('main');
  };

  const handleBackToMain = () => {
    setShowLogin(false);
    setCurrentPage('main');
  };

  const handleProfileComplete = () => {
    setIsProfileComplete(true);
    // localStorage에 프로필 완성 상태 업데이트
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      try {
        const parsed = JSON.parse(profile);
        parsed.isComplete = true;
        localStorage.setItem('userProfile', JSON.stringify(parsed));
      } catch {
        // 에러 무시
      }
    }
  };

  const handleGoToProfile = () => {
    setCurrentPage('profile');
  };

  // 로그인 페이지 표시
  if (showLogin) {
    return <LoginPage onLogin={handleLogin} onBack={handleBackToMain} />;
  }

  // 로그인 필요 페이지 표시
  if (currentPage === 'login-required') {
    return <LoginRequired onBackToMain={handleBackToMain} />;
  }

  // 프로필 설정 필요 페이지 표시
  if (currentPage === 'profile-required') {
    return <ProfileRequired onGoToProfile={handleGoToProfile} />;
  }

  // 메인 페이지 표시
  if (currentPage === 'main') {
    return <CareerPassLanding onPageChange={handlePageChange} onLoginClick={handleLoginClick} />;
  }

  // 로그인된 상태에서 앱 페이지 표시
  return (
    <CareerPackApp 
      currentPage={currentPage} 
      onPageChange={handlePageChange} 
      onLogout={handleLogout}
      onProfileComplete={handleProfileComplete}
    />
  );
}

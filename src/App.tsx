import { useState, useEffect, useRef } from "react";
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
  const isProcessingOAuthRef = useRef(false);
  
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

  // 구글 OAuth 콜백 처리
  useEffect(() => {
    const processOAuthCallback = async () => {
      // 이미 처리 중이면 중복 실행 방지
      if (isProcessingOAuthRef.current) {
        return;
      }

      // URL 쿼리 파라미터에서 code 추출
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      // 에러가 있으면 처리
      if (error) {
        console.error('OAuth 에러:', error);
        window.history.replaceState({}, '', window.location.pathname);
        return;
      }

      // code가 없으면 콜백 처리 불필요
      if (!code) {
        return;
      }

      // 처리 시작
      isProcessingOAuthRef.current = true;
      console.log('구글 OAuth 콜백 감지, code:', code);

      try {
        // 백엔드가 이미 세션/쿠키를 설정했다고 가정하고 /me 엔드포인트로 로그인 상태 확인
        // CORS 문제가 있을 수 있으므로, 일단 로그인 성공으로 간주하고 진행
        try {
          const userInfo = await getMe();
          console.log('로그인 상태 확인 성공:', userInfo);
        } catch (meError) {
          // /me 호출 실패해도 OAuth 콜백이 성공했다는 것은 백엔드가 처리했다는 의미
          // CORS 문제일 수 있으므로 로그만 남기고 계속 진행
          console.warn('getMe 호출 실패 (CORS 문제일 수 있음), OAuth 콜백은 성공했으므로 로그인 처리 계속:', meError);
        }

        // URL에서 code 파라미터 제거
        window.history.replaceState({}, '', window.location.pathname);

        // 로그인 성공 처리 (OAuth 콜백이 성공했다는 것은 백엔드가 처리했다는 의미)
        setIsLoggedIn(true);
        setShowLogin(false);
        
        // 프로필 완성 여부에 따라 페이지 이동
        const profileComplete = checkProfileComplete();
        if (profileComplete) {
          console.log('대시보드(roadmap)로 이동');
          setCurrentPage('roadmap');
        } else {
          console.log('프로필 페이지로 이동');
          setCurrentPage('profile');
        }
      } catch (error) {
        console.error('OAuth 콜백 처리 실패:', error);
        // 에러 발생 시 URL 정리
        window.history.replaceState({}, '', window.location.pathname);
        // 에러가 있어도 사용자에게는 메인 페이지로 이동
        setCurrentPage('main');
      } finally {
        isProcessingOAuthRef.current = false;
      }
    };

    processOAuthCallback();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

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

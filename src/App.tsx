import { useState, useEffect, useRef } from "react";
import { CareerPassLanding } from "./components/CareerPassLanding";
import { CareerPackApp } from "./components/CareerPackApp";
import { LoginPage } from "./components/LoginPage";
import { LoginRequired } from "./components/LoginRequired";
import { ProfileRequired } from "./components/ProfileRequired";
import { getMe, loginOrCreateUser } from "./api";

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
  
  // localStorage에서 프로필 완성 여부 확인 (name, major, targetJob 기준)
  const checkProfileComplete = () => {
    const profile = localStorage.getItem('userProfile');
    if (!profile) {
      return false;
    }
    try {
      const parsed = JSON.parse(profile);
      // name, major, targetJob 모두 truthy여야 완료
      return !!(parsed.name && parsed.major && parsed.targetJob);
    } catch {
      return false;
    }
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
        // 구글 OAuth 결과에서 email 추출
        // 백엔드가 OAuth 처리 후 email을 쿼리 파라미터로 반환하거나,
        // 또는 구글 API를 통해 직접 가져올 수 있음
        const urlParamsForEmail = new URLSearchParams(window.location.search);
        let googleEmail = urlParamsForEmail.get('email');
        
        // email이 쿼리 파라미터에 없으면, 구글 OAuth 토큰으로 사용자 정보 가져오기 시도
        // 또는 백엔드가 OAuth 처리 후 쿼리 파라미터로 전달할 수 있음
        if (!googleEmail) {
          // TODO: 구글 OAuth 토큰을 사용하여 구글 API에서 email 가져오기
          // 또는 백엔드가 OAuth 처리 후 쿼리 파라미터로 email을 전달하는 경우
          // 일단 에러 처리 (나중에 구글 API 연동 시 수정)
          console.warn('이메일 정보를 찾을 수 없습니다. 쿼리 파라미터에 email이 있는지 확인하세요.');
          throw new Error('이메일 정보가 없습니다. 구글 로그인 후 이메일이 제공되지 않았습니다.');
        }

        console.log('구글 로그인 이메일:', googleEmail);

        // 1) 가장 먼저 백엔드 로그인 or 자동가입 API 호출
        const profile = await loginOrCreateUser(googleEmail);
        console.log('로그인/자동가입 성공, 프로필:', profile);

        // 2) 백엔드가 준 profile 정보를 localStorage에 저장
        if (profile) {
          localStorage.setItem('userId', profile.id?.toString() || '');
          localStorage.setItem('careerpass_email', profile.email || googleEmail);
          
          if (profile.email) {
            const userProfile = {
              email: profile.email,
              name: profile.nickname || profile.name || '',
              department: profile.major || '',
              targetJob: profile.targetJob || '',
              isComplete: profile.profileCompleted || false
            };
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
          }
        }

        // URL에서 code 파라미터 제거
        window.history.replaceState({}, '', window.location.pathname);

        // 로그인 성공 처리
        setIsLoggedIn(true);
        setShowLogin(false);

        // 3) 로그인 후 무조건 학습프로필 유도 화면으로 이동
        console.log('로그인 성공 → 학습프로필 유도 화면으로 이동');
        setCurrentPage('profile-required' as PageType);
      } catch (error) {
        console.error('OAuth 콜백 처리 실패:', error);
        // 에러 발생 시 URL 정리
        window.history.replaceState({}, '', window.location.pathname);
        // 오류가 발생해도 OAuth 콜백이 있었다는 것은 성공으로 간주
        setIsLoggedIn(true);
        setShowLogin(false);
        // 로그인 후 무조건 학습프로필 유도 화면으로 이동
        setCurrentPage('profile-required' as PageType);
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
    // 로그인 후 무조건 학습프로필 유도 화면으로 이동
    setCurrentPage('profile-required' as PageType);
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
    // localStorage의 userProfile이 이미 업데이트되어 있으므로
    // checkProfileComplete()로 다시 확인하여 상태 갱신
    setIsProfileComplete(checkProfileComplete());
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

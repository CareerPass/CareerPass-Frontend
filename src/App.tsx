import { useState } from "react";
import { CareerPassLanding } from "./components/CareerPassLanding";
import { CareerPackApp } from "./components/CareerPackApp";
import { LoginPage } from "./components/LoginPage";
import { LoginRequired } from "./components/LoginRequired";
import { ProfileRequired } from "./components/ProfileRequired";
import { api } from "./api";

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
      api={api}
    />
  );
}

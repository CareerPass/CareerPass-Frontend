import { useState } from "react";
import { CareerPassLanding } from "./components/CareerPassLanding";
import { CareerPackApp } from "./components/CareerPackApp";
import { LoginPage } from "./components/LoginPage";
import { LoginRequired } from "./components/LoginRequired";
import { ProfileRequired } from "./components/ProfileRequired";

type PageType = 'main' | 'roadmap' | 'resume' | 'interview' | 'profile';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('main');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  const handlePageChange = (page: PageType) => {
    // 메인 페이지가 아닌데 로그인이 안되어 있으면 로그인 필요 페이지 표시
    if (page !== 'main' && !isLoggedIn) {
      setCurrentPage('login-required' as PageType);
      return;
    }
    
    // 로그인은 되어 있지만 프로필이 완성되지 않았고, 프로필 페이지가 아니면 프로필 설정 필요 페이지 표시
    if (page !== 'main' && page !== 'profile' && isLoggedIn && !isProfileComplete) {
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
    // 첫 로그인 시 학습 프로필 페이지로 이동
    setCurrentPage('profile');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsProfileComplete(false);
    setCurrentPage('main');
  };

  const handleBackToMain = () => {
    setShowLogin(false);
    setCurrentPage('main');
  };

  const handleProfileComplete = () => {
    setIsProfileComplete(true);
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

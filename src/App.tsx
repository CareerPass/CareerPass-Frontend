import { useEffect, useState } from "react";
import { CareerPassLanding } from "./components/CareerPassLanding";
import { CareerPackApp } from "./components/CareerPackApp";
import { LoginPage } from "./components/LoginPage";
import { LoginRequired } from "./components/LoginRequired";
import { ProfileRequired } from "./components/ProfileRequired";
import { getMe } from "./api";

type PageType = "main" | "roadmap" | "resume" | "interview" | "profile";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("main");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [me, setMe] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);

  // 🔑 앱 시작 시 로그인 상태 확인 (/me)
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await getMe(); // credentials: include 필수
        setMe(res);
        setIsLoggedIn(true);
      } catch {
        setMe(null);
        setIsLoggedIn(false);
      }
    };

    fetchMe();
  }, []);

  // 로그인 상태 아직 모르면 로딩 상태
  if (isLoggedIn === null) {
    return null; // 필요하면 로딩 컴포넌트
  }

  const isProfileComplete =
    !!me && !!me.nickname && !!me.major && !!me.targetJob;

  const handlePageChange = (page: PageType) => {
    if (page !== "main" && !isLoggedIn) {
      setCurrentPage("login-required" as PageType);
      return;
    }

    if (
      page !== "main" &&
      page !== "profile" &&
      isLoggedIn &&
      !isProfileComplete
    ) {
      setCurrentPage("profile-required" as PageType);
      return;
    }

    setCurrentPage(page);
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleBackToMain = () => {
    setShowLogin(false);
    setCurrentPage("main");
  };

  const handleLogout = async () => {
    try {
      await fetch("https://careerpass.duckdns.org/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {}

    setIsLoggedIn(false);
    setMe(null);
    setCurrentPage("main");
  };

  const handleProfileComplete = async () => {
    try {
      const res = await getMe();
      setMe(res);
    } catch {}
  };

  const handleGoToProfile = () => {
    setCurrentPage("profile");
  };

  // 로그인 페이지
  if (showLogin) {
    return <LoginPage onLogin={() => {}} onBack={handleBackToMain} />;
  }

  // 로그인 필요
  if (currentPage === "login-required") {
    return <LoginRequired onBackToMain={handleBackToMain} />;
  }

  // 프로필 필요
  if (currentPage === "profile-required") {
    return <ProfileRequired onGoToProfile={handleGoToProfile} />;
  }

  // 메인
  if (currentPage === "main") {
    return (
      <CareerPassLanding
        onPageChange={handlePageChange}
        onLoginClick={handleLoginClick}
      />
    );
  }

  // 로그인된 상태 앱
  return (
    <CareerPackApp
      currentPage={currentPage}
      onPageChange={handlePageChange}
      onLogout={handleLogout}
      onProfileComplete={handleProfileComplete}
    />
  );
}

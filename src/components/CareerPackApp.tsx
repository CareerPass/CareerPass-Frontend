import { useState } from "react";
import { Dashboard } from "./Dashboard";
import { DepartmentSelector, departments } from "./DepartmentSelector";
import { JobSelector } from "./JobSelector";
import { RoadmapView } from "./RoadmapView";
import { SubjectRoadmapView } from "./SubjectRoadmapView";
import { CertificationRoadmapView } from "./CertificationRoadmapView";
import { ProfileSection } from "./ProfileSection";
import { LearningProfile } from "./LearningProfile";
import { ResumeAI } from "./ResumeAI";
import { InterviewAI } from "./InterviewAI";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { GraduationCap, MapPin, BookOpen, Award, LogOut, User, FileText, Mic, Home } from "lucide-react";
import logoImage from "figma:asset/7c5aa6dae84b9f121dc975eb56a63a422cedd564.png";

type PageType = 'main' | 'roadmap' | 'resume' | 'interview' | 'profile';

interface CareerPackAppProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  onLogout: () => void;
  onProfileComplete?: () => void;
}

export function CareerPackApp({ currentPage, onPageChange, onLogout, onProfileComplete }: CareerPackAppProps) {
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [roadmapType, setRoadmapType] = useState<"subject" | "certification" | "">("");
  const [showInterviewDetail, setShowInterviewDetail] = useState(false);
  const [showResumeDetail, setShowResumeDetail] = useState(false);

  const selectedDeptData = departments.find(dept => dept.id === selectedDepartment);
  const availableJobs = selectedDeptData?.jobs || [];

  // Reset job selection when department changes
  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department);
    setSelectedJob("");
    setRoadmapType("");
  };

  const renderRoadmapSection = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-primary">취업 로드맵</h1>
        <p className="text-muted-foreground">
          학과별 직무 연계 교육과정 및 자격증 로드맵을 확인하세요
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h2>학과 및 직무 선택</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <DepartmentSelector
            selectedDepartment={selectedDepartment}
            onDepartmentChange={handleDepartmentChange}
          />
          <JobSelector
            jobs={availableJobs}
            selectedJob={selectedJob}
            onJobChange={setSelectedJob}
          />
        </div>
        {selectedDepartment && !selectedJob && (
          <p className="text-muted-foreground mt-4">
            {selectedDeptData?.name}을(를) 선택하셨습니다. 이제 관심 있는 직무를 선택해주세요.
          </p>
        )}
      </Card>

      {selectedDepartment && selectedJob ? (
        <div className="space-y-6">
          {/* 로드맵 유형 선택 */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <h2>로드맵 유형 선택</h2>
            </div>
            <div className="flex gap-4">
              <Button
                variant={roadmapType === "subject" ? "default" : "outline"}
                onClick={() => setRoadmapType("subject")}
                className="flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                교과목 로드맵
              </Button>
              <Button
                variant={roadmapType === "certification" ? "default" : "outline"}
                onClick={() => setRoadmapType("certification")}
                className="flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                자격증 로드맵
              </Button>
            </div>
          </Card>

          {/* 선택된 로드맵 표시 */}
          {roadmapType === "subject" && (
            <SubjectRoadmapView
              selectedDepartment={selectedDepartment}
              selectedJob={selectedJob}
            />
          )}
          {roadmapType === "certification" && (
            <CertificationRoadmapView
              selectedDepartment={selectedDepartment}
              selectedJob={selectedJob}
            />
          )}
          {!roadmapType && (
            <Card className="p-12">
              <div className="text-center space-y-4">
                <div className="flex justify-center gap-4">
                  <BookOpen className="w-16 h-16 text-blue-500" />
                  <Award className="w-16 h-16 text-purple-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">로드맵 유형을 선택해주세요</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    교과목 로드맵에서는 학년별 필수/권장 교과목을, 
                    자격증 로드맵에서는 취득 권장 자격증을 확인할 수 있습니다.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h3 className="text-muted-foreground">학과 연계 교육과정 로드맵</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                원하는 학과와 직무를 선택하시면 학년별 필수 교과목과 
                취득 권장 자격증을 확인하실 수 있습니다.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  const renderSubjectsSection = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-primary flex items-center gap-2">
          <BookOpen className="w-8 h-8" />
          교과목 로드맵
        </h1>
        <p className="text-muted-foreground">
          학과·직무별 교육과정 로드맵을 확인하세요
        </p>
      </div>

      <Card className="border-2 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h2>학과 및 직무 선택</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <DepartmentSelector
            selectedDepartment={selectedDepartment}
            onDepartmentChange={handleDepartmentChange}
          />
          <JobSelector
            jobs={availableJobs}
            selectedJob={selectedJob}
            onJobChange={setSelectedJob}
          />
        </div>
        {selectedDepartment && !selectedJob && (
          <p className="text-muted-foreground mt-4">
            {selectedDeptData?.name}을(를) 선택하셨습니다. 이제 관심 있는 직무를 선택해주세요.
          </p>
        )}
      </Card>

      {selectedDepartment && selectedJob ? (
        <SubjectRoadmapView
          selectedDepartment={selectedDepartment}
          selectedJob={selectedJob}
        />
      ) : (
        <Card className="border-2 rounded-xl p-12">
          <div className="text-center space-y-4">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h3 className="text-muted-foreground">학과·직무별 교육과정 로드맵</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                원하는 학과와 직무를 선택하시면 학년별 필수 교과목과 권장 교과목을 확인하실 수 있습니다.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  const renderCertificationsSection = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-primary flex items-center gap-2">
          <Award className="w-8 h-8" />
          자격증 로드맵
        </h1>
        <p className="text-muted-foreground">
          취득 권장 자격증을 확인하세요
        </p>
      </div>

      <Card className="border-2 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h2>학과 및 직무 선택</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <DepartmentSelector
            selectedDepartment={selectedDepartment}
            onDepartmentChange={handleDepartmentChange}
          />
          <JobSelector
            jobs={availableJobs}
            selectedJob={selectedJob}
            onJobChange={setSelectedJob}
          />
        </div>
        {selectedDepartment && !selectedJob && (
          <p className="text-muted-foreground mt-4">
            {selectedDeptData?.name}을(를) 선택하셨습니다. 이제 관심 있는 직무를 선택해주세요.
          </p>
        )}
      </Card>

      {selectedDepartment && selectedJob ? (
        <CertificationRoadmapView
          selectedDepartment={selectedDepartment}
          selectedJob={selectedJob}
        />
      ) : (
        <Card className="border-2 rounded-xl p-12">
          <div className="text-center space-y-4">
            <Award className="w-16 h-16 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h3 className="text-muted-foreground">취득 권장 자격증</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                원하는 학과와 직무를 선택하시면 취득을 권장하는 자격증을 확인하실 수 있습니다.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  const renderMainContent = () => {
    // 메인 페이지가 아닌 경우 해당 페이지 컴포넌트 렌더링
    if (currentPage === 'resume') {
      return <ResumeAI />;
    }
    if (currentPage === 'interview') {
      return <InterviewAI />;
    }
    if (currentPage === 'profile') {
      return <LearningProfile onProfileComplete={onProfileComplete} />;
    }

    // 로드맵 페이지의 경우 섹션에 따라 다르게 렌더링
    if (currentPage === 'roadmap') {
      switch (currentSection) {
        case "dashboard":
          return <Dashboard />;
        case "subjects":
          return renderSubjectsSection();
        case "certifications":
          return renderCertificationsSection();
        default:
          return <Dashboard />;
      }
    }

    // 기본값은 대시보드
    return <Dashboard />;
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      {/* 상단 네비게이션 */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* 로고 */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8">
                <img src={logoImage} alt="CareerPass Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-[#051243]">CareerPass</h2>
              </div>
            </div>

            {/* 메뉴 */}
            <div className="flex items-center gap-2">
              <Button
                variant={currentPage === 'roadmap' ? "default" : "ghost"}
                className={currentPage === 'roadmap' ? "bg-[#051243] text-white hover:bg-[#051243]/90" : "hover:bg-gray-100 hover:text-[#051243]"}
                onClick={() => {
                  onPageChange('roadmap');
                  setCurrentSection('dashboard');
                }}
              >
                <MapPin className="w-4 h-4 mr-2" />
                취업 로드맵
              </Button>
              <Button
                variant={currentPage === 'resume' ? "default" : "ghost"}
                className={currentPage === 'resume' ? "bg-[#051243] text-white hover:bg-[#051243]/90" : "hover:bg-gray-100 hover:text-[#051243]"}
                onClick={() => onPageChange('resume')}
              >
                <FileText className="w-4 h-4 mr-2" />
                자기소개서 AI
              </Button>
              <Button
                variant={currentPage === 'interview' ? "default" : "ghost"}
                className={currentPage === 'interview' ? "bg-[#051243] text-white hover:bg-[#051243]/90" : "hover:bg-gray-100 hover:text-[#051243]"}
                onClick={() => onPageChange('interview')}
              >
                <Mic className="w-4 h-4 mr-2" />
                AI 모의면접
              </Button>
              <Button
                variant={currentPage === 'profile' ? "default" : "ghost"}
                className={currentPage === 'profile' ? "bg-[#051243] text-white hover:bg-[#051243]/90" : "hover:bg-gray-100 hover:text-[#051243]"}
                onClick={() => onPageChange('profile')}
              >
                <User className="w-4 h-4 mr-2" />
                학습 프로필
              </Button>
              
              <div className="ml-4 pl-4 border-l border-gray-200">
                <Button
                  variant="outline"
                  onClick={onLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </div>
            </div>
          </div>

          {/* 취업 로드맵 하위 메뉴 */}
          {currentPage === 'roadmap' && (
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <Button
                variant={currentSection === 'dashboard' ? "default" : "ghost"}
                size="sm"
                className={currentSection === 'dashboard' ? "bg-[#051243] text-white hover:bg-[#051243]/90" : "hover:bg-gray-100"}
                onClick={() => setCurrentSection('dashboard')}
              >
                대시보드
              </Button>
              <Button
                variant={currentSection === 'subjects' ? "default" : "ghost"}
                size="sm"
                className={currentSection === 'subjects' ? "bg-[#051243] text-white hover:bg-[#051243]/90" : "hover:bg-gray-100"}
                onClick={() => setCurrentSection('subjects')}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                교과목
              </Button>
              <Button
                variant={currentSection === 'certifications' ? "default" : "ghost"}
                size="sm"
                className={currentSection === 'certifications' ? "bg-[#051243] text-white hover:bg-[#051243]/90" : "hover:bg-gray-100"}
                onClick={() => setCurrentSection('certifications')}
              >
                <Award className="w-4 h-4 mr-2" />
                자격증
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto p-8">
        {renderMainContent()}
      </main>
    </div>
  );
}

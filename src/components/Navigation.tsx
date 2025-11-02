import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  GraduationCap,
  MapPin,
  User,
  BookOpen,
  Award,
  BarChart3,
  Settings,
  FileText,
  Mic,
  Home,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import logoImage from "figma:asset/83510238e736cd0a50e47278737c5f6a27f22463.png";

type PageType = 'main' | 'roadmap' | 'resume' | 'interview' | 'profile';

interface NavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  currentPage?: PageType;
  onPageChange?: (page: PageType) => void;
}

export function Navigation({
  currentSection,
  onSectionChange,
  currentPage,
  onPageChange,
}: NavigationProps) {
  const [isRoadmapExpanded, setIsRoadmapExpanded] = useState(currentPage === 'roadmap');
  // 메인 카테고리 (페이지 전환)
  const mainCategories = [
    {
      id: "roadmap" as PageType,
      label: "취업 로드맵",
      icon: MapPin,
      description: "학과별 교육과정 로드맵",
      hasSubmenu: true,
    },
    {
      id: "resume" as PageType,
      label: "자기소개서 AI",
      icon: FileText,
      description: "AI 자소서 피드백",
    },
    {
      id: "interview" as PageType,
      label: "AI 모의면접",
      icon: Mic,
      description: "실전 모의면접 연습",
    },
    {
      id: "profile" as PageType,
      label: "학습 프로필",
      icon: User,
      description: "프로필 관리 및 학습 현황",
    },
  ];

  const roadmapSubmenus = [
    {
      id: "dashboard",
      label: "대시보드",
      icon: BarChart3,
      description: "전체 진행 현황 확인",
    },
    {
      id: "subjects",
      label: "교과목",
      icon: BookOpen,
      description: "학과·직무별 교육과정 로드맵",
    },
    {
      id: "certifications",
      label: "자격증",
      icon: Award,
      description: "취득 권장 자격증",
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8">
          <img src={logoImage} alt="CareerPass Logo" className="w-full h-full object-contain" />
        </div>
        <div>
          <h2 className="text-[#051243] font-bold">CareerPass</h2>
          <p className="text-sm text-gray-600">
            진로 설계 플랫폼
          </p>
        </div>
      </div>

      <nav className="space-y-4">
        {/* 메인 카테고리 */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600 px-2">메뉴</h3>
          {mainCategories.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <div key={item.id}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-between h-auto p-3 ${
                    isActive
                      ? "bg-[#051243] text-white"
                      : "hover:bg-gray-100 hover:text-[#051243]"
                  }`}
                  onClick={() => {
                    if (item.hasSubmenu) {
                      setIsRoadmapExpanded(!isRoadmapExpanded);
                      if (!isRoadmapExpanded) {
                        onPageChange?.(item.id);
                        onSectionChange('dashboard');
                      }
                    } else {
                      onPageChange?.(item.id);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">
                        {item.label}
                      </div>
                      <div className="text-sm opacity-75">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  {item.hasSubmenu && (
                    isRoadmapExpanded ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
                
                {/* 취업 로드맵 하위 메뉴 */}
                {item.hasSubmenu && isRoadmapExpanded && (
                  <div className="mt-2 ml-4 space-y-1">
                    {roadmapSubmenus.map((submenu) => {
                      const SubmenuIcon = submenu.icon;
                      const isSubmenuActive = currentSection === submenu.id && currentPage === 'roadmap';
                      
                      return (
                        <Button
                          key={submenu.id}
                          variant={isSubmenuActive ? "default" : "ghost"}
                          className={`w-full justify-start h-auto p-2 text-sm ${
                            isSubmenuActive
                              ? "bg-[#051243] text-white"
                              : "hover:bg-gray-100 hover:text-[#051243]"
                          }`}
                          onClick={() => {
                            onPageChange?.('roadmap');
                            onSectionChange(submenu.id);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <SubmenuIcon className="w-4 h-4" />
                            <div className="text-left">
                              <div className="font-medium">
                                {submenu.label}
                              </div>
                              <div className="text-xs opacity-75">
                                {submenu.description}
                              </div>
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </Card>
  );
}
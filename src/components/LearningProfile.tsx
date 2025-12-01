import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
// 백엔드 API 호출 제거 (localStorage만 사용)
import { 
  User, 
  GraduationCap, 
  Target, 
  BookOpen,
  Award,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  Star,
  Settings,
  X,
  ArrowLeft
} from "lucide-react";
import { fetchUserLearningProfile } from "../api";

interface LearningProfileProps {
  userId?: number;
  onProfileComplete?: () => void;
  onProfileInfoChange?: (userInfo: { name: string; major: string; targetJob: string }) => void;
}

// ✅ 이메일 하드코딩
const FIXED_EMAIL = "jiyun1430@mju.ac.kr";

export function LearningProfile({ userId, onProfileComplete, onProfileInfoChange }: LearningProfileProps = {}) {
  const [userInfo, setUserInfo] = useState({
    id: null as number | null,
    name: "",
    email: FIXED_EMAIL,
    major: "",
    targetJob: ""
  });
  // 학습프로필 완료 여부 계산 함수
  const calculateProfileCompleted = (info: typeof userInfo): boolean => {
    return !!(info.name && info.name.trim() !== "" && 
              info.major && info.major.trim() !== "" && 
              info.targetJob && info.targetJob.trim() !== "");
  };

  const [profileCompleted, setProfileCompleted] = useState(false);

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: FIXED_EMAIL,
    major: "",
    targetJob: ""
  });
  const [showInterviewDetail, setShowInterviewDetail] = useState(false);
  const [showResumeDetail, setShowResumeDetail] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 사용자 정보 초기화 - 자동 저장 제거, 항상 빈 값으로 시작
  useEffect(() => {
    setIsLoading(true);
    
    // 항상 빈 값으로 시작 (localStorage에서 자동으로 불러오지 않음)
    const defaultUserInfo = {
      id: null as number | null,
      name: "",
      email: FIXED_EMAIL,
      major: "",
      targetJob: ""
    };
    setUserInfo(defaultUserInfo);
    setProfileCompleted(false);
    
    setIsLoading(false);
  }, []);

  // 자기소개서 리스트 로드
  useEffect(() => {
    async function loadIntroductions() {
      try {
        setIsLoadingIntroductions(true);
        const profile = await fetchUserLearningProfile(1);
        setRecentIntroductions(profile.recentIntroductions ?? []);
      } catch (e) {
        console.error('자기소개서 리스트 로드 실패:', e);
        // 에러 발생 시 빈 배열로 설정
        setRecentIntroductions([]);
      } finally {
        setIsLoadingIntroductions(false);
      }
    }
    loadIntroductions();
  }, []);

  const [achievements] = useState([
    {
      type: "certification",
      title: "정보처리기사",
      date: "2024.12.15",
      status: "완료",
      grade: "합격",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200"
    },
    {
      type: "certification", 
      title: "SQLD",
      date: "2024.11.20",
      status: "완료",
      grade: "합격",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200"
    },
    {
      type: "subject",
      title: "데이터베이스 시스템",
      date: "2024.12.10",
      status: "완료",
      grade: "A+",
      credits: "3학점",
      color: "bg-blue-100 text-blue-700 border-blue-200"
    },
    {
      type: "subject",
      title: "자료구조와 알고리즘",
      date: "2024.11.25",
      status: "완료", 
      grade: "A",
      credits: "3학점",
      color: "bg-blue-100 text-blue-700 border-blue-200"
    },
    {
      type: "subject",
      title: "운영체제",
      date: "2024.11.15",
      status: "완료",
      grade: "B+",
      credits: "3학점", 
      color: "bg-blue-100 text-blue-700 border-blue-200"
    }
  ]);

  const [recentInterviews] = useState([
    {
      date: "2024.12.18",
      company: "네이버",
      position: "백엔드 개발자",
      feedback: "기술적 지식은 우수하나 소통 능력 개선 필요",
      rating: 3.5
    },
    {
      date: "2024.12.12",
      company: "카카오",
      position: "서버 개발자", 
      feedback: "문제 해결 능력이 뛰어나고 학습 의욕이 높음",
      rating: 4.2
    },
    {
      date: "2024.12.05",
      company: "토스",
      position: "백엔드 엔지니어",
      feedback: "프로젝트 경험을 더 쌓아서 실무 역량 강화 권장",
      rating: 3.8
    }
  ]);

  // 자기소개서 리스트 상태 (백엔드에서 가져옴)
  const [recentIntroductions, setRecentIntroductions] = useState<Array<{
    introductionId: number;
    title: string | null;
    date: string;
  }>>([]);
  const [isLoadingIntroductions, setIsLoadingIntroductions] = useState(false);

  const handleEditProfile = () => {
    // 모달 열 때 입력 필드 초기값 설정
    setEditForm({
      name: userInfo.name || "",
      email: FIXED_EMAIL, // ✅ 항상 고정 이메일
      major: userInfo.major || "",
      targetJob: userInfo.targetJob || ""
    });
    setSaveError(null); // 에러 상태 초기화
    setShowEditProfile(true);
  };

  const handleSaveProfile = () => {
    // isSaving = true
    setIsSaving(true);

    // 프론트 상태만 갱신 (백엔드 API 호출 없음)
    const newUserInfo = {
      id: userInfo.id,
      name: editForm.name,
      email: FIXED_EMAIL, // 하드코딩된 이메일
      major: editForm.major,
      targetJob: editForm.targetJob
    };
    
    // userInfo 상태 업데이트
    setUserInfo(newUserInfo);
    
    // profileCompleted를 true로 설정
    setProfileCompleted(true);
    
    // localStorage 업데이트 (isComplete 필드 제거, name/major/targetJob만 저장)
    const userProfile = {
      email: FIXED_EMAIL,
      name: editForm.name,
      major: editForm.major,
      targetJob: editForm.targetJob
    };
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    // 상위 컴포넌트에 userInfo 변경 알림
    if (onProfileInfoChange) {
      onProfileInfoChange({
        name: newUserInfo.name,
        major: newUserInfo.major,
        targetJob: newUserInfo.targetJob
      });
    }

    // 모달 닫기
    setShowEditProfile(false);

    // 프로필 설정 완료 콜백 호출
    if (onProfileComplete) {
      onProfileComplete();
    }
    
    // isSaving = false
    setIsSaving(false);
  };

  const handleInterviewClick = () => {
    setShowInterviewDetail(true);
  };

  const handleResumeClick = () => {
    setShowResumeDetail(true);
  };

  // 면접 상세 화면
  if (showInterviewDetail) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowInterviewDetail(false)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로가기
          </Button>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-primary flex items-center gap-2">
            <MessageSquare className="w-8 h-8" />
            면접 피드백 상세
          </h1>
          <p className="text-muted-foreground">네이버 백엔드 개발자 면접 결과 및 피드백입니다</p>
        </div>

        {/* 요약 정보 카드 */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-2 rounded-xl">
            <CardContent className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">6분 20초</p>
                <p className="text-muted-foreground">총 진행 시간</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 rounded-xl">
            <CardContent className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">5개</p>
                <p className="text-muted-foreground">총 질문 개수</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 rounded-xl">
            <CardContent className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto flex items-center justify-center mb-3">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">3.5점</p>
                <p className="text-muted-foreground">평균 점수</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI 영역별 피드백 */}
        <Card className="border-2 rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              AI 영역별 피드백
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="text-green-600">✅</span>
              <div>
                <p className="font-medium text-green-900">기술적 깊이</p>
                <p className="text-green-800">지원한 분야와 관련된 기술 스택에 대한 이해도가 우수합니다.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <span className="text-yellow-600">⚠️</span>
              <div>
                <p className="font-medium text-yellow-900">문제 해결 능력</p>
                <p className="text-yellow-800">구체적인 경험을 들어 해결 과정을 설명하면 더 좋습니다.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-blue-600">🤝</span>
              <div>
                <p className="font-medium text-blue-900">협업 능력</p>
                <p className="text-blue-800">팀 프로젝트 경험과 소통 방식을 강조하세요.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <span className="text-purple-600">🚀</span>
              <div>
                <p className="font-medium text-purple-900">성장 의지</p>
                <p className="text-purple-800">부족한 점을 인정하고 보완 계획을 제시하세요.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 질문별 상세 결과 */}
        <Card className="border-2 rounded-xl">
          <CardHeader>
            <CardTitle>질문별 상세 결과</CardTitle>
            <CardDescription>각 질문에 대한 답변 분석 결과입니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "자기소개를 해주세요.",
              "본인의 강점과 약점은 무엇인가요?",
              "팀 프로젝트에서 갈등이 생겼을 때 어떻게 해결하나요?",
              "기술적으로 어려웠던 문제를 해결한 경험이 있나요?",
              "우리 회사에 지원한 이유는 무엇인가요?"
            ].map((question, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">질문 {index + 1}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>답변 시간: {Math.floor(Math.random() * 30) + 30}초</span>
                    <span className="font-medium text-primary">{Math.floor(Math.random() * 20) + 70}점</span>
                  </div>
                </div>
                <p className="text-muted-foreground">{question}</p>
                <div className="bg-muted/50 p-3 rounded border-l-4 border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    {index === 0 ? "네, 안녕하세요. 저는 주로 백엔드 개발에 관심이 많아 Node.js와 Python을 활용한 프로젝트를 여러 개 진행했습니다..." :
                     index === 1 ? "제 강점은 문제 해결 능력입니다. 복잡한 문제를 단계별로 나누어 체계적으로 접근하는 편이고, 약점은 때로는 완벽주의 성향이 강해서..." :
                     index === 2 ? "팀 프로젝트에서 의견 충돌이 있을 때는 먼저 각자의 입장을 충분히 들어보고, 공통의 목표를 다시 확인한 후..." :
                     index === 3 ? "네, 최근 프로젝트에서 대용량 데이터 처리 시 성능 이슈가 발생했는데, 데이터베이스 인덱싱과 쿼리 최적화를 통해..." :
                     "네이버는 기술 혁신을 통해 사용자의 일상을 편리하게 만든다는 비전에 공감했고, 특히 검색과 AI 기술 분야에서..."}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI 종합 피드백 */}
        <Card className="border-2 rounded-xl bg-gradient-to-r from-primary/5 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              AI 종합 피드백
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/70 p-4 rounded-lg border border-primary/20">
              <p className="text-primary font-medium mb-2">📋 전체적인 평가</p>
              <p className="text-gray-700 leading-relaxed">
                기술적 지식은 우수하나 소통 능력 개선이 필요합니다. 특히 복잡한 기술 개념을 
                쉽게 설명하는 연습을 권장합니다. 전반적으로 면접에 임하는 자세가 좋고, 
                자신의 경험을 구체적으로 설명하는 부분이 인상적이었습니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 자소서 상세 화면
  if (showResumeDetail) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowResumeDetail(false)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로가기
          </Button>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-primary flex items-center gap-2">
            <FileText className="w-8 h-8" />
            자소서 피드백 상세
          </h1>
          <p className="text-muted-foreground">네이버 인턴십 지원서 상세 피드백입니다</p>
        </div>

        {/* 자소서 기본 정보 */}
        <Card className="border-2 rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              자소서 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">제목</p>
                <p className="font-medium">네이버 인턴십 지원서</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">작성 날짜</p>
                <p className="font-medium">2024.12.20</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">피드백 상태</p>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 rounded-full px-3 py-1">
                  피드백 완료
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI 분석 결과 */}
        <Card className="border-2 rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              AI 분석 결과
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">📋 전체적인 분석</h4>
              <p className="text-blue-800">
                전체적으로 경험을 구체적으로 잘 서술하셨습니다. 특히 프로젝트 성과를 수치로 표현한 부분이 인상적입니다. 
                다만 지원동기 부분에서 회사에 대한 이해도를 더 보여주시면 좋겠습니다.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">✅ 강점</h4>
              <ul className="text-green-800 list-disc list-inside space-y-1">
                <li>구체적인 성과 지표 활용 (예: 30% 향상, 15명 협업)</li>
                <li>STAR 기법을 활용한 체계적인 경험 서술</li>
                <li>전공 지식과 실무 역량의 연결성</li>
                <li>논리적이고 일관된 문장 구성</li>
              </ul>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">💡 개선 제안</h4>
              <ul className="text-yellow-800 list-disc list-inside space-y-1">
                <li>지원동기에서 회사의 핵심 가치와 본인의 목표 연결</li>
                <li>첫 문단을 더 임팩트 있게 시작하는 방법 고려</li>
                <li>차별화된 개인적 경험이나 관점 추가</li>
                <li>네이버 특유의 기술 스택이나 문화에 대한 언급</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 문항별 상세 피드백 */}
        <Card className="border-2 rounded-xl">
          <CardHeader>
            <CardTitle>문항별 상세 피드백</CardTitle>
            <CardDescription>각 문항에 대한 AI 분석 결과입니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              {
                title: "1. 자기소개 및 성장과정",
                content: "저는 어릴 때부터 기술을 통해 사람들의 삶을 편리하게 만드는 것에 관심이 많았습니다. 대학에 입학한 후 컴퓨터공학을 전공하며 프로그래밍의 매력에 빠져...",
                feedback: "개인적인 경험과 동기가 잘 드러나며, 전공 선택의 이유가 명확합니다. 다만 더 구체적인 에피소드를 추가하면 차별화될 수 있습니다.",
                score: 85
              },
              {
                title: "2. 지원동기 및 입사 후 포부",
                content: "네이버는 한국을 대표하는 기술 기업으로, 검색부터 커머스, 클라우드까지 다양한 영역에서 혁신을 이끌고 있습니다. 특히 AI와 머신러닝 기술을 활용한...",
                feedback: "회사에 대한 기본적인 이해는 있으나, 더 구체적인 사업 영역이나 기술 스택에 대한 언급이 있으면 좋겠습니다.",
                score: 75
              },
              {
                title: "3. 본인의 역량 및 경험",
                content: "대학 재학 중 총 3개의 프로젝트를 진행했으며, 그 중 가장 의미있었던 것은 교내 식당 예약 시스템 개발 프로젝트입니다. 팀 리더로서 5명의 팀원과 함께...",
                feedback: "프로젝트 경험이 구체적이고 성과가 명확합니다. 리더십과 기술적 역량이 잘 드러나는 좋은 사례입니다.",
                score: 90
              }
            ].map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{item.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-primary">{item.score}점</span>
                  </div>
                </div>
                <div className="bg-muted/50 p-3 rounded border-l-4 border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2">작성 내용:</p>
                  <p className="text-sm">{item.content}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-1">AI 피드백:</p>
                  <p className="text-sm text-blue-800">{item.feedback}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI 종합 피드백 */}
        <Card className="border-2 rounded-xl bg-gradient-to-r from-primary/5 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              AI 종합 피드백
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/70 p-4 rounded-lg border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full mt-1">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className="text-primary font-medium">📋 종합 평가</p>
                  <p className="text-gray-700 leading-relaxed">
                    자기소개서의 구체적인 경험 서술이 인상적입니다. 특히 프로젝트에서의 리더십과 
                    문제 해결 능력이 잘 드러나며, 기술적 역량에 대한 설명이 체계적입니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/70 p-4 rounded-lg border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-full mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-green-700 font-medium">💪 핵심 강점</p>
                  <p className="text-gray-700 leading-relaxed">
                    구체적인 수치와 성과를 활용한 경험 서술, STAR 기법을 통한 체계적인 구성, 
                    그리고 기술적 지식과 실무 경험의 자연스러운 연결이 돋보입니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/70 p-4 rounded-lg border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-full mt-1">
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-blue-700 font-medium">🎯 개선 방향</p>
                  <p className="text-gray-700 leading-relaxed">
                    지원동기 부분에서 네이버의 기술 스택이나 기업 문화에 대한 구체적인 언급을 
                    추가하고, 개인만의 차별화된 경험이나 관점을 더 강조하면 완성도가 높아질 것입니다.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F8FB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#051243] mx-auto mb-4"></div>
          <p className="text-gray-600">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 프로필 수정 오버레이 */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-2 rounded-xl bg-white shadow-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  프로필 수정
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowEditProfile(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>이름</Label>
                <Input 
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  disabled={isSaving}
                  placeholder="이름을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label>이메일</Label>
                <Input 
                  value={editForm.email}
                  readOnly
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label>전공</Label>
                <Input 
                  value={editForm.major}
                  onChange={(e) => setEditForm({...editForm, major: e.target.value})}
                  disabled={isSaving}
                  placeholder="전공을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label>목표 직무</Label>
                <Input 
                  value={editForm.targetJob}
                  onChange={(e) => setEditForm({...editForm, targetJob: e.target.value})}
                  disabled={isSaving}
                  placeholder="목표 직무를 입력하세요"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleSaveProfile} 
                  className="flex-1"
                  disabled={isSaving}
                >
                  {isSaving ? "저장 중..." : "저장"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowEditProfile(false);
                    setSaveError(null);
                  }}
                  className="flex-1"
                  disabled={isSaving}
                >
                  취소
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 페이지 헤더 */}
      <div className="space-y-2">
        <h1 className="text-primary flex items-center gap-2">
          <User className="w-8 h-8" />
          학습 프로필
        </h1>
        <p className="text-muted-foreground">
          개인 정보, 성취 기록, 그리고 최근 활동을 확인하세요
        </p>
      </div>

      {/* 기본 정보 카드 */}
      <Card className="border-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="w-5 h-5 text-primary" />
              </div>
              기본 정보
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEditProfile}
              className="flex items-center gap-2 rounded-lg"
            >
              <Settings className="w-4 h-4" />
              설정/수정
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* 학습프로필 미설정 시 안내 문구 */}
          {!profileCompleted && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm text-yellow-800">
                  기능을 이용하시려면 학습프로필을 먼저 등록해주세요.
                </p>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleEditProfile}
                  className="ml-4 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  학습프로필 설정
                </Button>
              </div>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">이름</p>
              <p className="font-medium">{userInfo.name || "이름 미설정"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">이메일</p>
              <p className="font-medium">{userInfo.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">전공</p>
              <p className="font-medium">{userInfo.major || "전공 미설정"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">목표 직무</p>
              <p className="font-medium">{userInfo.targetJob || "목표 직무 미설정"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 성취 기록 섹션 */}
      <div className="space-y-6">
        <h2 className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          성취 기록
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* 자격증 취득 내역 카드 */}
          <Card className="border-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                자격증 취득 내역
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.filter(item => item.type === 'certification').map((cert, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50/70 border border-emerald-200/30">
                    <div className="p-2 rounded-full bg-emerald-500 text-white">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{cert.title}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 rounded-full px-3 py-1">
                          ✅ {cert.grade}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {cert.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 교과목 성적 카드 */}
          <Card className="border-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                교과목 성적 내역
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.filter(item => item.type === 'subject').map((subject, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-sky-50/70 border border-blue-200/30">
                    <div className="p-2 rounded-full bg-blue-400 text-white">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{subject.title}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`${subject.grade === 'A+' ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : subject.grade === 'A' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-sky-100 text-sky-700 border-sky-300'} rounded-full px-3 py-1`}>
                          {subject.grade}
                        </Badge>
                        <Badge variant="outline" className="text-xs rounded-full border-blue-200">
                          {subject.credits}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {subject.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 최근 면접 기록 섹션 */}
      <div className="space-y-6">
        <h2 className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary" />
          최근 면접 기록
        </h2>
        
        <div className="space-y-4">
          {recentInterviews.map((interview, index) => (
            <Card 
              key={index} 
              className="border-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-primary/20"
              onClick={handleInterviewClick}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-lg">{interview.company}</p>
                    <p className="text-muted-foreground">{interview.position}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-yellow-700">{interview.rating}</span>
                  </div>
                </div>
                <p className="text-sm mb-3 text-gray-600 line-clamp-2">{interview.feedback}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {interview.date}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 최근 자소서 기록 섹션 */}
      <div className="space-y-6">
        <h2 className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          최근 자소서 기록
        </h2>
        
        {isLoadingIntroductions ? (
          <div className="text-center py-8 text-muted-foreground">
            자기소개서 리스트를 불러오는 중...
          </div>
        ) : recentIntroductions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            아직 저장된 자기소개서 학습 기록이 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {recentIntroductions.map((intro) => {
              const title = intro.title && intro.title.trim().length > 0
                ? intro.title
                : "네이버 자기소개서";
              const summary = "AI가 분석한 핵심 개선 포인트가 정리된 자기소개서입니다.";

              return (
                <Card 
                  key={intro.introductionId} 
                  className="border-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-primary/20"
                  onClick={handleResumeClick}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-medium text-lg">{title}</p>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200 rounded-full px-3 py-1">
                        피드백 완료
                      </Badge>
                    </div>
                    <p className="text-sm mb-3 text-gray-600 line-clamp-2">{summary}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {intro.date}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
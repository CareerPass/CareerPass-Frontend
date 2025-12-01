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
  ArrowLeft,
  AlertCircle,
  Bot,
  Brain
} from "lucide-react";
import { fetchUserLearningProfile, updateUserProfile, getFeedbackByIntroductionId } from "../api";
import ReactMarkdown from "react-markdown";

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
  const [isProfileSaved, setIsProfileSaved] = useState(false);

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
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ========== [시연용] 사용자 정보 초기화 - 페이지 이동 시 유지, 서버 재시작 시 초기화 ==========
  useEffect(() => {
    setIsLoading(true);
    
    try {
      // [시연용] sessionStorage를 사용하여 플래그 관리
      // - 페이지 이동 시에는 유지됨 (같은 브라우저 탭)
      // - npm run dev로 서버 재시작 후 브라우저를 새로 열면 초기화됨 (sessionStorage 특성)
      const savedFlag = sessionStorage.getItem('learningProfileSaved');
      const isSaved = savedFlag === 'true';
      
      setIsProfileSaved(isSaved);
      
      if (isSaved) {
        // [시연용] 저장된 경우에만 learningProfile에서 값 불러오기
        // 페이지 이동 시에도 값이 유지되도록 함
        const storedProfile = localStorage.getItem('learningProfile');
        if (storedProfile) {
          try {
            const parsed = JSON.parse(storedProfile);
            const loadedUserInfo = {
              id: null as number | null,
              name: parsed.name || "",
              email: parsed.email || FIXED_EMAIL,
              major: parsed.major || "",
              targetJob: parsed.targetJob || parsed.jobTitle || ""
            };
            setUserInfo(loadedUserInfo);
            setProfileCompleted(calculateProfileCompleted(loadedUserInfo));
          } catch (parseError) {
            console.error('learningProfile 파싱 실패:', parseError);
            // 파싱 실패 시 빈 값으로 시작
            const defaultUserInfo = {
              id: null as number | null,
              name: "",
              email: FIXED_EMAIL,
              major: "",
              targetJob: ""
            };
            setUserInfo(defaultUserInfo);
            setProfileCompleted(false);
          }
        } else {
          // 플래그는 true인데 데이터가 없으면 빈 값으로 시작
          const defaultUserInfo = {
            id: null as number | null,
            name: "",
            email: FIXED_EMAIL,
            major: "",
            targetJob: ""
          };
          setUserInfo(defaultUserInfo);
          setProfileCompleted(false);
        }
      } else {
        // [시연용] 저장 전 상태: 빈 값으로 시작
        // npm run dev로 서버 재시작 후 브라우저를 새로 열면 sessionStorage가 비어있어서 여기로 옴
        const defaultUserInfo = {
          id: null as number | null,
          name: "",
          email: FIXED_EMAIL,
          major: "",
          targetJob: ""
        };
        setUserInfo(defaultUserInfo);
        setProfileCompleted(false);
      }
    } catch (error) {
      console.error('프로필 초기화 실패:', error);
      // 에러 발생 시 빈 값으로 시작
      const defaultUserInfo = {
        id: null as number | null,
        name: "",
        email: FIXED_EMAIL,
        major: "",
        targetJob: ""
      };
      setUserInfo(defaultUserInfo);
      setProfileCompleted(false);
      setIsProfileSaved(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 자기소개서 리스트 로드
  const loadIntroductions = async () => {
    try {
      setIsLoadingIntroductions(true);
      const profile = await fetchUserLearningProfile(1);
      const backendData = profile.recentIntroductions ?? [];
      
      // 하드코딩된 기본 데이터 (항상 표시)
      const hardcodedItem = {
        introductionId: 1,
        title: null,
        date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\./g, '.').replace(/\s/g, '')
      };
      
      // 백엔드 데이터가 있으면 하드코딩 데이터와 병합, 없으면 하드코딩 데이터만 사용
      if (backendData.length > 0) {
        // 하드코딩 데이터가 중복되지 않도록 필터링 후 병합
        const filteredBackend = backendData.filter(item => item.introductionId !== 1);
        setRecentIntroductions([hardcodedItem, ...filteredBackend]);
      } else {
        // 백엔드 데이터가 없으면 하드코딩 데이터만 사용
        setRecentIntroductions([hardcodedItem]);
      }
    } catch (e) {
      console.error('자기소개서 리스트 로드 실패:', e);
      // 에러 발생 시에도 하드코딩된 데이터는 항상 표시
      const hardcodedItem = {
        introductionId: 1,
        title: null,
        date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\./g, '.').replace(/\s/g, '')
      };
      setRecentIntroductions([hardcodedItem]);
    } finally {
      setIsLoadingIntroductions(false);
    }
  };

  useEffect(() => {
    loadIntroductions();

    // 자기소개서 저장 이벤트 리스너 등록
    const handleIntroductionSaved = () => {
      console.log('자기소개서 저장 이벤트 감지, 리스트 갱신 중...');
      // 짧은 딜레이 후 리스트 다시 로드 (서버 반영 시간 고려)
      setTimeout(() => {
        loadIntroductions();
      }, 500);
    };

    window.addEventListener('introductionSaved', handleIntroductionSaved);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('introductionSaved', handleIntroductionSaved);
    };
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

  // 하드코딩된 면접 기록 (컴퓨터공학과, 시스템소프트웨어 개발자)
  const [recentInterviews] = useState([
    {
      id: 1,
      date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\./g, '.').replace(/\s/g, ''),
      company: "시스템소프트웨어 개발자",
      position: "시스템소프트웨어 개발자",
      major: "컴퓨터공학과",
      feedback: "백엔드 개발자로서의 목표 의식과 기술적 깊이가 잘 드러났으며, 데이터 기반 문제 해결 능력이 인상적입니다.",
      rating: 4.5
    }
  ]);
  
  // 면접 상세 데이터 (하드코딩)
  const hardcodedInterviewData = {
    questions: [
      "백엔드 개발자를 목표로 하게 된 이유와 '사용자가 보지 못하는 곳의 안정성을 책임지는 사람'이라는 표현에 대한 생각을 말씀해주세요.",
      "팀 프로젝트에서 '백엔드는 서비스의 중심축'이라는 생각으로 협업에 참여하셨다고 하셨는데, 구체적인 경험과 역할을 설명해주세요.",
      "API 응답 속도를 40% 단축한 경험에 대해, 문제를 어떻게 발견하고 해결했는지 구체적으로 설명해주세요.",
      "데이터 기반 접근 방식이 백엔드 개발자에게 왜 중요한지, 그리고 토스의 데이터 기반 의사결정 문화와 어떻게 연결되는지 말씀해주세요.",
      "앞으로 기술적 깊이를 넓히고 팀과 함께 성장하고 싶다고 하셨는데, 구체적인 계획이나 학습 방향이 있으신가요?"
    ],
    answers: [
      "저는 사용자가 보지 못하는 곳에서 시스템이 안정적으로 동작하도록 만드는 것이 백엔드 개발자의 핵심 가치라고 생각합니다. 자료구조, 운영체제, 데이터베이스 등 핵심 이론을 학습하면서 시스템의 견고함에 더 큰 흥미를 느꼈고, 특히 예측 불가한 트래픽이나 오류 상황에서도 안정적으로 서비스를 제공해야 한다는 점에서 백엔드 개발자의 책임감과 판단력이 중요하다고 실감했습니다.",
      "팀 프로젝트에서는 단순히 요청대로 기능을 구현하는 것을 넘어, 왜 필요한지, 어떤 제약이 있는지, 더 나은 구조는 없는지를 먼저 질문했습니다. 프론트엔드 팀원과 API 스펙을 맞추는 과정에서 기능 구현보다 먼저 커뮤니케이션 구조와 일정 관리를 정리하여 프로젝트 전체 흐름을 조율하는 역할을 맡았습니다.",
      "사용자 활동 로그를 분석하여 API 응답 속도 저하 구간을 찾아냈고, 쿼리 구조를 개선하여 평균 응답 속도를 40% 단축했습니다. 이 과정에서 '문제를 감으로 해결하지 않고, 데이터로 원인을 추적하는 것'이 백엔드 개발자의 핵심 태도임을 깨달았습니다.",
      "데이터베이스 설계 시 작은 제약 조건 하나가 성능과 안정성에 큰 차이를 만들고, 일정 관리는 장애 대응 속도와 서비스 신뢰도에 직결됩니다. 토스가 추구하는 데이터 기반 의사결정 문화와 제가 중요하게 여기는 데이터 기반 접근 방식이 일치한다고 생각합니다.",
      "앞으로도 기술적 깊이를 넓히고, 변화에 빠르게 대응하며, 팀과 함께 더 나은 결정을 만들어가는 개발자로 성장하고 싶습니다. 특히 시스템 아키텍처와 성능 최적화 분야에 더 깊이 있게 학습하고, 실제 프로젝트에 적용해보는 것을 목표로 하고 있습니다."
    ],
    overallScore: 88
  };

  // 자기소개서 리스트 상태 (백엔드에서 가져옴, 프론트엔드 하드코딩 데이터 포함)
  const [recentIntroductions, setRecentIntroductions] = useState<Array<{
    introductionId: number;
    title: string | null;
    date: string;
  }>>([
    // 프론트엔드 하드코딩: 제공된 자기소개서 기반 피드백이 항상 표시되도록
    {
      introductionId: 1,
      title: null,
      date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\./g, '.').replace(/\s/g, '')
    }
  ]);
  const [isLoadingIntroductions, setIsLoadingIntroductions] = useState(false);
  
  // 제공된 자기소개서 기반 하드코딩된 피드백 (프론트엔드에서 항상 표시)
  const hardcodedFeedback = `## 전체적인 평가

토스 백엔드 개발자 지원 자기소개서를 검토한 결과, 회사에 대한 깊은 이해와 본인의 경험을 효과적으로 연결한 잘 구성된 자기소개서입니다. 특히 토스의 핵심 가치(안정성, 수평적 조직 문화, 데이터 기반 의사결정)와 본인의 경험을 자연스럽게 연결한 점이 인상적입니다.

## 강점

1. **명확한 회사 이해와 연결**: 
   - "사용자가 보지 못하는 곳의 안정성을 책임지는 사람"이라는 백엔드 개발자에 대한 철학을 토스의 금융 서비스 특성(안정성 핵심)과 명확하게 연결
   - 토스의 수평적 조직 문화, 데이터 기반 의사결정 등 회사의 핵심 가치를 정확히 파악하고 본인의 경험과 연결

2. **구체적이고 검증 가능한 성과**: 
   - API 응답 속도 40% 단축이라는 정량적 성과 제시
   - 사용자 활동 로그 분석 → 문제 구간 파악 → 쿼리 구조 개선이라는 문제 해결 과정이 논리적으로 서술됨

3. **협업 능력과 리더십**: 
   - "백엔드는 서비스의 중심축"이라는 인식에서 비롯된 적극적 협업 태도
   - 단순 구현을 넘어 "왜 필요한지, 어떤 제약이 있는지, 더 나은 구조는 없는지"를 먼저 질문하는 사고력
   - API 스펙 조율, 커뮤니케이션 구조 정리, 일정 관리 등 프로젝트 조율 경험

4. **데이터 기반 문제 해결**: 
   - "감으로 해결하지 않고, 데이터로 원인을 추적"하는 태도가 실제 경험(로그 분석, 쿼리 개선)으로 뒷받침됨
   - 토스의 데이터 기반 의사결정 문화와의 자연스러운 연결

## 개선 제안

1. **기술적 세부사항 보강**: 
   - 사용한 기술 스택(프레임워크, 데이터베이스, 언어 등)을 구체적으로 언급하면 기술적 역량이 더 명확하게 전달됩니다.
   - 쿼리 구조 개선 시 어떤 최적화 기법을 사용했는지 간단히 언급하면 좋습니다.

2. **프로젝트 맥락 구체화**: 
   - 팀 프로젝트의 규모(팀원 수, 프로젝트 기간, 서비스 규모 등)를 추가하면 경험의 깊이를 더 잘 보여줄 수 있습니다.
   - API 응답 속도 개선이 어떤 사용자 경험 개선으로 이어졌는지 간단히 언급하면 더욱 설득력이 높아집니다.

3. **토스 특화 경험 강조**: 
   - 금융 서비스나 핀테크 관련 경험이 있다면 더욱 강조하면 좋습니다.
   - 토스의 특정 서비스나 기술에 대한 관심이나 학습 경험을 언급하면 지원 동기가 더욱 구체화됩니다.

## 종합 의견

토스 백엔드 개발자로서 필요한 핵심 역량(안정성에 대한 이해, 데이터 기반 문제 해결, 협업 능력)이 모두 잘 드러나며, 특히 토스의 조직 문화와 가치에 대한 깊은 이해가 돋보입니다. 구체적인 성과(API 응답 속도 40% 개선)와 문제 해결 과정이 논리적으로 서술되어 있어, 실무 역량을 충분히 보여주고 있습니다. 기술적 세부사항과 프로젝트 맥락을 조금 더 구체화하면 더욱 강력한 자기소개서가 될 것입니다.`;
  
  // 자기소개서 피드백 상태 (상세 화면에서 사용)
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null);

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

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // ========== [시연용] 프론트 상태 갱신 ==========
      const newUserInfo = {
        id: userInfo.id,
        name: editForm.name,
        email: FIXED_EMAIL,
        major: editForm.major,
        targetJob: editForm.targetJob
      };
      
      setUserInfo(newUserInfo);
      setProfileCompleted(calculateProfileCompleted(newUserInfo));
      
      // ========== [시연용] learningProfile을 localStorage에 저장 ==========
      // 프로필 정보는 localStorage.learningProfile에 저장 (페이지 이동 시에도 유지)
      const learningProfile = {
        name: editForm.name,
        major: editForm.major,
        jobTitle: editForm.targetJob,
        email: FIXED_EMAIL
      };
      localStorage.setItem('learningProfile', JSON.stringify(learningProfile));
      
      // ========== [시연용] 저장 버튼을 누른 경우에만 learningProfileSaved를 true로 설정 ==========
      // sessionStorage를 사용하여 플래그 저장
      // - 페이지 이동 시에는 유지됨 (같은 브라우저 탭)
      // - npm run dev로 서버 재시작 후 브라우저를 새로 열면 sessionStorage가 비어있어서 초기화됨
      sessionStorage.setItem('learningProfileSaved', 'true');
      setIsProfileSaved(true);
      
      // 상위 컴포넌트에 userInfo 변경 알림
      if (onProfileInfoChange) {
        onProfileInfoChange({
          name: newUserInfo.name,
          major: newUserInfo.major,
          targetJob: newUserInfo.targetJob
        });
      }

      // 성공 메시지 표시 (3초 후 자동 사라짐)
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);

      // 모달 닫기
      setShowEditProfile(false);

      // 프로필 설정 완료 콜백 호출
      if (onProfileComplete) {
        onProfileComplete();
      }
    } catch (err: any) {
      console.error('프로필 저장 실패:', err);
      setSaveError(err.message || '프로필 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInterviewClick = () => {
    setShowInterviewDetail(true);
  };
  
  // 면접 상세 화면
  if (showInterviewDetail) {
    const interview = recentInterviews[0];
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
            <Brain className="w-8 h-8" />
            AI 모의면접 결과
          </h1>
          <p className="text-muted-foreground">면접 분석 결과 및 피드백입니다</p>
        </div>

        {/* 면접 기본 정보 */}
        <Card className="border-2 rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              면접 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">전공</p>
                <p className="font-medium">{interview.major}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">직무</p>
                <p className="font-medium">{interview.position}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">면접 날짜</p>
                <p className="font-medium">{interview.date}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 종합 점수 */}
        <Card className="border-2 rounded-xl bg-gradient-to-r from-primary/5 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              종합 점수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">{hardcodedInterviewData.overallScore}</div>
                <div className="text-2xl font-semibold text-muted-foreground">점</div>
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
            {hardcodedInterviewData.questions.map((question, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">질문 {index + 1}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>답변 시간: {Math.floor(Math.random() * 20) + 45}초</span>
                    <span className="font-medium text-primary">{Math.floor(Math.random() * 10) + 85}점</span>
                  </div>
                </div>
                <p className="text-muted-foreground">{question}</p>
                <div className="bg-muted/50 p-3 rounded border-l-4 border-muted-foreground/20">
                  <p className="text-muted-foreground italic">답변 내용: {hardcodedInterviewData.answers[index]}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI 종합 피드백 */}
        <Card className="border-2 rounded-xl bg-gradient-to-r from-primary/5 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI 종합 피드백
            </CardTitle>
            <CardDescription>
              전체 면접을 종합적으로 분석한 AI의 조언입니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/70 p-4 rounded-lg border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full mt-1">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className="text-primary font-medium">📋 전체적인 평가</p>
                  <p className="text-gray-700 leading-relaxed">
                    백엔드 개발자로서의 목표 의식과 기술적 깊이가 명확하게 드러났습니다. 특히 "사용자가 보지 못하는 곳의 안정성을 책임지는 사람"이라는 백엔드 개발자에 대한 철학적 이해가 깊고, 이를 실제 경험(API 응답 속도 40% 개선, 팀 프로젝트 협업)과 잘 연결하여 설명했습니다. 데이터 기반 문제 해결 접근 방식과 토스의 개발 문화에 대한 이해도가 인상적입니다.
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
                  <p className="text-green-700 font-medium">💪 주요 강점</p>
                  <p className="text-gray-700 leading-relaxed">
                    구체적이고 검증 가능한 성과(API 응답 속도 40% 단축)를 제시했으며, 문제 해결 과정(로그 분석 → 문제 구간 파악 → 쿼리 구조 개선)을 논리적으로 설명했습니다. "백엔드는 서비스의 중심축"이라는 인식에서 비롯된 적극적 협업 태도와, 단순 구현을 넘어 "왜 필요한지, 어떤 제약이 있는지"를 먼저 질문하는 사고력이 돋보입니다. 토스의 핵심 가치(안정성, 수평적 조직 문화, 데이터 기반 의사결정)와 본인의 경험을 자연스럽게 연결한 점도 강점입니다.
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
                  <p className="text-blue-700 font-medium">🎯 개선 포인트</p>
                  <p className="text-gray-700 leading-relaxed">
                    기술적 세부사항(사용한 기술 스택, 프레임워크, 데이터베이스 종류 등)을 더 구체적으로 언급하면 기술적 역량이 더 명확하게 전달될 수 있습니다. 또한 프로젝트의 규모(팀원 수, 프로젝트 기간, 서비스 규모 등)를 추가하면 경험의 깊이를 더 잘 보여줄 수 있습니다. 답변 시간을 조금 더 여유있게 활용하시고, 각 답변의 마무리를 더 명확하게 하면 완성도가 높아질 것입니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/70 p-4 rounded-lg border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-full mt-1">
                  <Star className="w-4 h-4 text-purple-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-purple-700 font-medium">🚀 앞으로의 방향</p>
                  <p className="text-gray-700 leading-relaxed">
                    현재 수준에서 실제 면접에 충분히 대응할 수 있을 것으로 보입니다. 기술 스택과 프로젝트 경험을 더 구체화하고, 다양한 상황별 질문에 대한 연습을 더 해보시면 자신감도 더욱 향상될 것입니다. 특히 시스템 아키텍처와 성능 최적화 분야에 대한 학습 계획을 구체적으로 제시하면 더욱 강력한 면접이 될 것입니다.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleResumeClick = async () => {
    // 카드 클릭 시 lastIntroductionId로 피드백 불러오기
    const lastId = localStorage.getItem("lastIntroductionId");
    if (lastId) {
      try {
        const feedback = await getFeedbackByIntroductionId(Number(lastId));
        // 응답이 배열인지 단일 객체인지 확인
        if (Array.isArray(feedback) && feedback.length > 0) {
          setSelectedFeedback(feedback[0]);
        } else if (feedback) {
          setSelectedFeedback(feedback);
        } else {
          // 피드백이 없으면 하드코딩된 피드백 사용
          setSelectedFeedback({ feedback: hardcodedFeedback });
        }
        setShowResumeDetail(true);
      } catch (error) {
        console.error('피드백 불러오기 실패, 하드코딩된 피드백 사용:', error);
        // API 실패 시 하드코딩된 피드백 사용
        setSelectedFeedback({ feedback: hardcodedFeedback });
        setShowResumeDetail(true);
      }
    } else {
      // lastId가 없어도 하드코딩된 피드백 사용
      setSelectedFeedback({ feedback: hardcodedFeedback });
      setShowResumeDetail(true);
    }
  };


  // 자소서 상세 화면
  if (showResumeDetail) {
    // 자소서 정보 가져오기 (하드코딩된 데이터에서)
    const resumeInfo = recentIntroductions.find(intro => intro.introductionId === 1) || recentIntroductions[0];
    const resumeTitle = resumeInfo?.title || "네이버 자기소개서";
    const resumeDate = resumeInfo?.date || new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\./g, '.').replace(/\s/g, '');
    const feedbackText = selectedFeedback?.feedback || hardcodedFeedback;

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
            <Bot className="w-8 h-8" />
            자기소개서 AI 피드백
          </h1>
          <p className="text-muted-foreground">AI가 분석한 자기소개서 피드백 결과입니다</p>
        </div>

        {/* 자소서 기본 정보 - 유지 */}
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
                <p className="font-medium">{resumeTitle}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">작성 날짜</p>
                <p className="font-medium">{resumeDate}</p>
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

        {/* AI 분석 결과 - ResumeAI.tsx와 동일한 구조 */}
        <Card className="border-2 rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              AI 분석 결과
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {feedbackText ? (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">📋 AI 피드백</h4>
                <div 
                  className="text-blue-800 prose prose-sm max-w-none"
                  style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                >
                  <ReactMarkdown>{feedbackText}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-600">피드백을 불러오는 중...</p>
              </div>
            )}
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
              {saveError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800 text-sm">{saveError}</p>
                </div>
              )}
              {saveSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <p className="text-green-800 text-sm">프로필이 저장되었습니다.</p>
                </div>
              )}
              <div className="space-y-2">
                <Label>이름</Label>
                <Input 
                  value={editForm.name}
                  onChange={(e) => {
                    setEditForm({...editForm, name: e.target.value});
                    setSaveError(null);
                    setSaveSuccess(false);
                  }}
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
                  onChange={(e) => {
                    setEditForm({...editForm, major: e.target.value});
                    setSaveError(null);
                    setSaveSuccess(false);
                  }}
                  disabled={isSaving}
                  placeholder="전공을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label>목표 직무</Label>
                <Input 
                  value={editForm.targetJob}
                  onChange={(e) => {
                    setEditForm({...editForm, targetJob: e.target.value});
                    setSaveError(null);
                    setSaveSuccess(false);
                  }}
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
          {/* 학습프로필 상태 안내 문구 */}
          {!isProfileSaved ? (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm text-yellow-800">
                  아직 학습 프로필이 설정되지 않았습니다. 이름, 전공, 목표 직무를 입력해 주세요.
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
          ) : (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                저장된 학습 프로필입니다. 필요하다면 언제든 수정할 수 있습니다.
              </p>
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
              // 카드 이름을 "백엔드 개발 직무"로 하드코딩
              const title = "백엔드 개발 직무";
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
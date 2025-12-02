import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Input } from "./ui/input"; // Input은 다른 곳에서 사용되므로 유지
import { Mic, Brain, Play, Settings, Check, Clock, Star, TrendingUp, MessageCircle, BarChart3, Target, FileText, Loader } from "lucide-react"; 
import { MAJOR_OPTIONS, getJobOptionsByMajor } from "../data/departmentJobData";
import { generateInterviewQuestions } from "../api";

type InterviewStep = 'main' | 'preparation' | 'interview' | 'analysis' | 'result';

export function InterviewAI() {
  const [currentStep, setCurrentStep] = useState<InterviewStep>('main');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [answers, setAnswers] = useState<string[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);
    
  // --- 상태 변수 ---
  const [majorInput, setMajorInput] = useState("");
  const [jobInput, setJobInput] = useState("");
  const [resumeText, setResumeText] = useState(""); 
  const [fetchedQuestions, setFetchedQuestions] = useState<string[]>([]); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  // -------------------------

  // 학과 선택에 따른 직무 옵션 동적 업데이트
  const jobOptions = majorInput ? getJobOptionsByMajor(majorInput) : [];

  // 학과 변경 시 직무 초기화
  const handleMajorChange = (value: string) => {
    setMajorInput(value);
    setJobInput("");
  };

  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const questions = fetchedQuestions;
    
  // --- API 호출 함수 (핵심 연결 부분) ---
  const fetchQuestions = useCallback(async () => {
    // Input 대신 Select로 변경되었으므로, 초기 placeholder 값 ""이 아닌지 확인
    if (!majorInput.trim() || !jobInput.trim()) {
      setError("학과와 직무 정보를 모두 선택해야 합니다.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // userId 가져오기
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError("로그인이 필요합니다. 먼저 로그인해주세요.");
        setIsLoading(false);
        return;
      }

      // 올바른 API 함수 사용
      const data = await generateInterviewQuestions({
        userId: parseInt(userId),
        coverLetter: resumeText || undefined
      });

      // API 응답 형식: { questions: [{ questionId, text }, ...] }
      if (data.questions && data.questions.length > 0) {
        // questions 배열에서 text 속성 추출
        const questionTexts = data.questions.map((q: any) => q.text || q);
        setFetchedQuestions(questionTexts);
        setCurrentStep('preparation'); // 성공 시 준비 단계로 이동
      } else {
        setError("AI가 질문을 생성하지 못했습니다. 입력 정보를 확인해주세요.");
        setFetchedQuestions([]);
      }
        
    } catch (e: any) {
      console.error('면접 질문 생성 오류:', e);
      setError(e.message || "서버 연결에 실패했습니다. 서버가 실행 중인지 확인해주세요.");
      setFetchedQuestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [majorInput, jobInput, resumeText]);
  // ----------------------------------------
    
  // startInterview 함수를 fetchQuestions로 대체합니다.
  const startInterview = fetchQuestions; 

  const beginInterview = () => {
    if (questions.length === 0) {
        setError("질문 목록이 없습니다. 메인 화면으로 돌아가 다시 시작해주세요.");
        setCurrentStep('main');
        return;
    }
    
    setCurrentStep('interview');
    setCurrentQuestion(0);
    setTimeLeft(60);
    startTimer();
  };

  const startTimer = () => {
    setIsRecording(true);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setAnswers(prevAnswers => [...prevAnswers, `(답변 녹음 내용)`]); 
          nextQuestion();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const nextQuestion = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
    
    // 답변 저장 (currentQuestion이 questions.length보다 작을 때만)
    if (currentQuestion < questions.length && answers.length === currentQuestion) {
        setAnswers(prevAnswers => [...prevAnswers, `(답변 녹음 내용)`]);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimeLeft(60);
      // 다음 질문까지 2초 대기
      setTimeout(() => startTimer(), 2000); 
    } else {
      finishInterview();
    }
  };

  const finishInterview = () => {
    // 마지막 질문의 답변을 확실히 저장
    if (currentQuestion === questions.length - 1 && answers.length < questions.length) {
        setAnswers(prevAnswers => [...prevAnswers, `(답변 녹음 내용)`]);
    }

    setCurrentStep('analysis');
    setAnalysisProgress(0);
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setCurrentStep('result');
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const resetInterview = () => {
    setCurrentStep('main');
    setCurrentQuestion(0);
    setIsRecording(false);
    setTimeLeft(60);
    setAnswers([]);
    setFetchedQuestions([]); 
    setAnalysisProgress(0);
    setError(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };
    
  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
    
  // --- 렌더링 함수 ---
    
  if (currentStep === 'preparation') {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-primary flex items-center gap-2">
            <Mic className="w-8 h-8" />
            면접 준비
          </h1>
          <p className="text-muted-foreground">면접을 시작하기 전에 마이크를 체크해주세요</p>
          <div className="bg-primary/10 text-primary p-3 rounded-lg border border-primary/30">
            <h4 className="font-medium">면접 질문 ({questions.length}개)</h4>
            <ul className="list-disc ml-5 text-sm space-y-1 mt-1">
                {questions.map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </div>
        </div>

        <Card className="border-2 rounded-xl p-8">
          <CardContent className="space-y-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                <Mic className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-2">마이크 확인</h3>
                <p className="text-muted-foreground">원활한 면접을 위해 마이크가 정상 작동하는지 확인해주세요</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Mic className="w-5 h-5 text-primary" />
                  <span>마이크</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">연결됨</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">💡 면접 팁</h4>
              <ul className="text-blue-800 space-y-1">
                <li>• 조용한 환경에서 진행해주세요</li>
                <li>• 마이크에 가까이서 명확하게 답변해주세요</li>
                <li>• 각 질문당 1분의 답변 시간이 주어집니다</li>
              </ul>
            </div>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={resetInterview}>
                취소
              </Button>
              <Button size="lg" className="px-8" onClick={beginInterview}>
                면접 시작하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

    
  if (currentStep === 'interview') {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-primary flex items-center gap-2">
            <Mic className="w-8 h-8" />
            AI 모의면접 진행중
          </h1>
          <p className="text-muted-foreground">질문 {currentQuestion + 1} / {questions.length}</p>
        </div>

        <Card className="border-2 rounded-xl p-8">
          <CardContent className="space-y-8">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center 
                ${isRecording ? 'bg-red-100 animate-pulse' : 'bg-gray-100'}`}>
                  <Mic className={`w-16 h-16 ${isRecording ? 'text-red-600' : 'text-gray-500'}`} />
                </div>
                {isRecording && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      REC
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                  <h3 className="font-medium mb-3">질문 {currentQuestion + 1}</h3>
                  <p className="text-lg">{questions[currentQuestion]}</p>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-medium">남은 시간: {timeLeft}초</span>
                </div>

                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${((60 - timeLeft) / 60) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={nextQuestion}>
                다음 질문
              </Button>
              <Button variant="destructive" onClick={finishInterview}> 
                면접 종료 
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

    
  if (currentStep === 'analysis') {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-primary flex items-center gap-2">
            <Brain className="w-8 h-8" />
            AI 분석 중
          </h1>
          <p className="text-muted-foreground">면접 답변을 분석하고 있습니다...</p>
        </div>

        <Card className="border-2 rounded-xl p-8">
          <CardContent className="text-center space-y-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
              <Brain className="w-10 h-10 text-primary animate-pulse" />
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">AI가 면접 답변을 분석하고 있습니다</h3>
              <p className="text-muted-foreground">음성, 내용, 태도를 종합적으로 분석하여 맞춤형 피드백을 준비중입니다</p>
                
              <div className="space-y-2">
                <Progress value={analysisProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">{analysisProgress}% 완료</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <BarChart3 className="w-8 h-8 mx-auto text-blue-600" />
                <p className="font-medium">음성 분석</p>
              </div>
              <div className="space-y-2">
                <MessageCircle className="w-8 h-8 mx-auto text-green-600" />
                <p className="font-medium">내용 분석</p>
              </div>
              <div className="space-y-2">
                <Target className="w-8 h-8 mx-auto text-purple-600" />
                <p className="font-medium">태도 분석</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

    
  if (currentStep === 'result') {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-primary flex items-center gap-2">
            <Star className="w-8 h-8" />
            면접 결과
          </h1>
          <p className="text-muted-foreground">AI 분석 결과를 확인해보세요</p>
        </div>

        
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
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">{questions.length}개</p> 
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
                <p className="text-2xl font-bold text-primary">87.5점</p>
                <p className="text-muted-foreground">평균 점수</p>
              </div>
            </CardContent>
          </Card>
        </div>

        
        <Card className="border-2 rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI 결과
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="text-green-600">✅</span>
              <div>
                <p className="font-medium text-green-900">기술적 깊이</p>
                <p className="text-green-800">지원한 분야와 관련된 기술 스택에 대한 이해를 보여주세요.</p>
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

        
        <Card className="border-2 rounded-xl">
          <CardHeader>
            <CardTitle>질문별 상세 결과</CardTitle>
            <CardDescription>각 질문에 대한 답변 분석 결과입니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((question, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">질문 {index + 1}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>답변 시간: {Math.floor(Math.random() * 30) + 30}초</span>
                    <span className="font-medium text-primary">{Math.floor(Math.random() * 20) + 80}점</span>
                  </div>
                </div>
                <p className="text-muted-foreground">{question}</p>
                <div className="bg-muted/50 p-3 rounded border-l-4 border-muted-foreground/20">
                  <p className="text-muted-foreground italic">답변 내용: {answers[index] || "답변 내용이 없습니다."}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        
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
                  <MessageCircle className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className="text-primary font-medium">📋 전체적인 평가</p>
                  <p className="text-gray-700 leading-relaxed">
                    전반적으로 면접에 임하는 자세가 좋고, 기술적 지식도 충분히 갖추고 계신 것 같습니다.
                    특히 자신의 경험을 구체적인 사례로 설명하는 부분이 인상적이었습니다.
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
                    문제 해결 과정을 체계적으로 설명하는 능력과 팀워크에 대한 이해도가 뛰어납니다.
                    또한 질문의 의도를 정확히 파악하고 적절한 답변을 제시했습니다.
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
                    답변 시간을 조금 더 여유있게 활용하시고, 회사에 대한 사전 조사 내용을 더 구체적으로  
                    언급하면 지원 의지를 더 강하게 어필할 수 있을 것 같습니다.
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
                    현재 수준에서 실제 면접에 충분히 대응할 수 있을 것으로 보입니다.
                    다양한 상황별 질문에 대한 연습을 더 해보시면 자신감도 더욱 향상될 것입니다.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="px-8" onClick={resetInterview}>
            새 면접 시작
          </Button>
          <Button variant="outline" size="lg" className="px-8">
            결과 다운로드
          </Button>
          <Button variant="ghost" className="text-primary">
            학습 프로필로 이동
          </Button>
        </div>
      </div>
    );
  }

    
  // --- Main 화면 렌더링 (Select 태그 적용) ---
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI 모의면접</h1>
        <p className="text-muted-foreground">실전 같은 모의면접, AI가 함께합니다</p>
      </div>

      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Mic className="h-5 w-5 text-red-600" />
              <CardTitle className="text-lg">음성인식 분석</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              실시간 음성인식으로 답변을 분석하고 즉시 피드백을 제공합니다.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">AI 피드백</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              발음, 속도, 어투까지 세밀하게 분석하여 개선점을 알려드립니다.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">실전 환경</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              언제 어디서든 실제 면접과 같은 환경에서 연습할 수 있습니다.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      
      <Card className="p-8">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Mic className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl">면접 정보를 입력하고 시작해보세요</CardTitle>
          <CardDescription className="text-lg">
            학과, 직무 정보를 바탕으로 맞춤형 면접 질문이 생성됩니다.
          </CardDescription>
            
          {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg border border-red-300 text-sm font-medium">
                ⚠️ {error}
              </div>
          )}

        </CardHeader>
        <CardContent className="space-y-6">
            
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 🚨 학과 Input을 Select로 수정 */}
            <div className="space-y-2">
              <Label htmlFor="major">학과 정보</Label>
              <select
                id="major"
                value={majorInput}
                onChange={(e) => handleMajorChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>학과를 선택하세요</option>
                {MAJOR_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            {/* 🚨 직무 Input을 Select로 수정 */}
            <div className="space-y-2">
              <Label htmlFor="job">지원 직무</Label>
              <select
                id="job"
                value={jobInput}
                onChange={(e) => setJobInput(e.target.value)}
                disabled={!majorInput || jobOptions.length === 0}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>직무를 선택하세요</option>
                {jobOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
            

          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Mic className="h-12 w-12 text-gray-500" />
            </div>
            <p className="text-gray-600 mb-4">마이크 준비가 완료되면 면접을 시작할 수 있습니다</p>
            <div className="flex justify-center space-x-4">
              <Button 
                size="lg" 
                className="px-8" 
                onClick={startInterview}
                disabled={isLoading || !majorInput.trim() || !jobInput.trim()} 
              >
                {isLoading ? (
                    <><Loader className="mr-2 h-4 w-4 animate-spin" /> 질문 생성 중...</>
                ) : (
                    <><Play className="mr-2 h-4 w-4" /> 면접 시작</>
                )}
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                <Settings className="mr-2 h-4 w-4" />
                설정
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      
      <Card className="border-2 rounded-xl">
        <CardHeader className="min-h-[220px] flex flex-col justify-center">
          <div className="flex items-center justify-between h-full">
            <div className="flex flex-col justify-center gap-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <CardTitle>자기소개서 기반 면접</CardTitle>
              </div>
              <CardDescription className="mt-0">
                자기소개서를 업로드하면 내용을 바탕으로 맞춤형 질문을 받을 수 있습니다
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 py-8">
          <div className="space-y-4">
            <Label htmlFor="resume">자기소개서 내용</Label>
            <Textarea
              id="resume"
              placeholder="자기소개서 내용을 입력해주세요..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={22}
              className="resize-none"
            />
          </div>
          {resumeText.trim() && (
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">자기소개서가 등록되었습니다</p>
                  <p className="text-sm text-green-800">면접 시작 시 자기소개서 기반 질문이 포함됩니다.</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      
      <Card>
        <CardHeader>
          <CardTitle>최근 면접 기록</CardTitle>
          <CardDescription>이전 모의면접 결과를 확인하고 개선점을 파악해보세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">기본 면접 - 2024.01.15</h4>
                <p className="text-sm text-muted-foreground">전체 점수: 85점 · 소요시간: 12분</p>
              </div>
              <Button variant="outline" size="sm">결과 보기</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">IT 직무 면접 - 2024.01.12</h4>
                <p className="text-sm text-muted-foreground">전체 점수: 78점 · 소요시간: 15분</p>
              </div>
              <Button variant="outline" size="sm">결과 보기</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

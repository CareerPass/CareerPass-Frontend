import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Mic, Video, Brain, Play, Settings, Check, Clock, Star, TrendingUp, MessageCircle, BarChart3, Target } from "lucide-react";

type InterviewStep = 'main' | 'preparation' | 'interview' | 'analysis' | 'result';

export function InterviewAI() {
  const [currentStep, setCurrentStep] = useState<InterviewStep>('main');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [answers, setAnswers] = useState<string[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();

  const questions = [
    "간단한 자기소개를 부탁드립니다.",
    "우리 회사에 지원한 이유는 무엇인가요?",
    "본인의 가장 큰 강점은 무엇이라고 생각하시나요?",
    "팀 프로젝트에서 갈등이 생겼을 때 어떻게 해결하시나요?",
    "5년 후 본인의 모습을 어떻게 그리고 계시나요?"
  ];

  const startInterview = () => {
    setCurrentStep('preparation');
  };

  const beginInterview = () => {
    setCurrentStep('interview');
    setCurrentQuestion(0);
    setTimeLeft(60);
    startTimer();
  };

  const startTimer = () => {
    setIsRecording(true);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
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
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimeLeft(60);
      setTimeout(() => startTimer(), 2000);
    } else {
      finishInterview();
    }
  };

  const finishInterview = () => {
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
    setAnalysisProgress(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // 면접 준비 화면
  if (currentStep === 'preparation') {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-primary flex items-center gap-2">
            <Mic className="w-8 h-8" />
            면접 준비
          </h1>
          <p className="text-muted-foreground">면접을 시작하기 전에 마이크를 체크해주세요</p>
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

  // 면접 진행 화면
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
                <div className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center ${isRecording ? 'bg-red-100 animate-pulse' : 'bg-gray-100'}`}>
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
              <Button variant="destructive" onClick={resetInterview}>
                면접 종료
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // AI 분석 중 화면
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

  // 결과 화면
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

        {/* 상단 요약 카드 (3개 가로 배치) */}
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
                <p className="text-2xl font-bold text-primary">87.5점</p>
                <p className="text-muted-foreground">평균 점수</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 중앙 AI 결과 카드 */}
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

        {/* 질문별 리뷰 리스트 */}
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
                  <p className="text-muted-foreground italic">답변 내용: —</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI 종합 피드백 요약 */}
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

        {/* 하단 액션 버튼 */}
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

  // 메인 화면 (기존 코드)
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI 모의면접</h1>
        <p className="text-muted-foreground">실전 같은 모의면접, AI가 함께합니다</p>
      </div>

      {/* 기능 소개 카드 */}
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

      {/* 모의면접 시작 */}
      <Card className="p-8">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Mic className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl">AI 모의면접을 시작해보세요</CardTitle>
          <CardDescription className="text-lg">
            AI 면접관이 실시간으로 질문하고 답변을 분석해 드립니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Mic className="h-12 w-12 text-gray-500" />
            </div>
            <p className="text-gray-600 mb-4">마이크 준비가 완료되면 면접을 시작할 수 있습니다</p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" className="px-8" onClick={startInterview}>
                <Play className="mr-2 h-4 w-4" />
                면접 시작
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                <Settings className="mr-2 h-4 w-4" />
                설정
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 면접 유형 선택 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>기본 면접</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              일반적인 면접 질문으로 구성된 기본 모의면접을 진행합니다.
            </CardDescription>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">자기소개</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">지원동기</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">강점/약점</span>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span>직무별 면접</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              선택한 직무에 특화된 전문 질문으로 구성된 모의면접입니다.
            </CardDescription>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">기술면접</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">상황판단</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">문제해결</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 최근 면접 기록 */}
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
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { FileText, Upload, Bot, CheckCircle, Send, User, MessageSquare, Edit3, X } from "lucide-react";

export function ResumeAI() {
  const [currentStep, setCurrentStep] = useState<'upload' | 'write' | 'analysis' | 'chat'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [directWriteText, setDirectWriteText] = useState('');
  const [messages, setMessages] = useState<Array<{
    id: number;
    type: 'user' | 'ai';
    content: string;
    timestamp: string;
  }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      setCurrentStep('analysis');
      // 분석 시뮬레이션 후 채팅으로 전환
      setTimeout(() => {
        setCurrentStep('chat');
        const initialMessage = {
          id: Date.now(),
          type: 'ai' as const,
          content: '자기소개서를 분석했습니다! 어떤 부분에 대해 피드백을 받고 싶으신가요? 예를 들어 "첫 번째 문단을 개선하고 싶어요" 또는 "지원동기 부분이 약한 것 같아요" 등으로 질문해 주세요.',
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages([initialMessage]);
      }, 2000);
    }
  };

  const handleDirectWrite = () => {
    setCurrentStep('write');
  };

  const handleCancelWrite = () => {
    setCurrentStep('upload');
    setDirectWriteText('');
  };

  const handleCompleteWrite = () => {
    if (directWriteText.trim()) {
      setCurrentStep('analysis');
      // 분석 시뮬레이션 후 채팅으로 전환
      setTimeout(() => {
        setCurrentStep('chat');
        const initialMessage = {
          id: Date.now(),
          type: 'ai' as const,
          content: '작성하신 자기소개서를 분석했습니다! 어떤 부분에 대해 피드백을 받고 싶으신가요? 예를 들어 "첫 번째 문단을 개선하고 싶어요" 또는 "지원동기 부분이 약한 것 같아요" 등으로 질문해 주세요.',
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages([initialMessage]);
      }, 2000);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user' as const,
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiResponses = [
        "문단의 시작 부분을 경험이나 성취로 시작하면 더 돋보입니다. 구체적인 수치나 결과를 포함해서 '○○ 프로젝트에서 △△ 역할을 맡아 ××% 성과를 달성했습니다'와 같이 작성해보세요.",
        "지원동기는 회사에 대한 구체적인 이해를 바탕으로 작성하는 것이 좋습니다. '해당 회사의 ○○ 가치와 제가 추구하는 △△가 일치한다'는 식으로 연결점을 찾아보세요.",
        "경험을 서술할 때는 STAR 기법(Situation, Task, Action, Result)을 활용해보세요. 상황 → 과제 → 행동 → 결과 순으로 구조화하면 더 설득력 있게 전달됩니다.",
        "전체적으로 좋은 내용이지만, 더 개인적이고 차별화된 스토리를 포함하면 어떨까요? 다른 지원자와 구별되는 특별한 경험이나 관점을 강조해보세요."
      ];

      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai' as const,
        content: randomResponse,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInputMessage('');
  };

  // 직접 작성하기 페이지
  if (currentStep === 'write') {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-primary flex items-center gap-2">
            <Edit3 className="w-8 h-8" />
            자기소개서 직접 작성
          </h1>
          <p className="text-muted-foreground">자기소개서를 직접 작성하고 AI 피드백을 받아보세요</p>
        </div>

        <Card className="border-2 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              자소서 작성 창
            </CardTitle>
            <CardDescription>
              자기소개서를 작성해 주세요. AI가 내용을 분석하여 맞춤형 피드백을 제공합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="자기소개서를 입력하세요..."
              value={directWriteText}
              onChange={(e) => setDirectWriteText(e.target.value)}
              className="min-h-[300px] resize-none border-2 rounded-xl focus:border-primary/50 transition-colors"
              maxLength={2000}
            />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {directWriteText.length} / 2000자
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleCancelWrite}
                  className="px-6"
                >
                  <X className="w-4 h-4 mr-2" />
                  취소
                </Button>
                <Button 
                  onClick={handleCompleteWrite}
                  disabled={!directWriteText.trim()}
                  className="px-6"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  작성 완료
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 작성 가이드 */}
        <Card className="border-2 rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              작성 가이드
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-1">💡 효과적인 자소서 작성 팁</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• 구체적인 경험과 성과를 수치로 표현하세요</li>
                <li>• STAR 기법(상황-과제-행동-결과)을 활용하세요</li>
                <li>• 지원 직무와 관련된 역량을 강조하세요</li>
              </ul>
            </div>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-1">✅ 포함하면 좋은 내용</h4>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• 자기소개 (강점, 성격, 가치관)</li>
                <li>• 지원동기 (회사 및 직무에 대한 관심)</li>
                <li>• 경험 및 역량 (학업, 프로젝트, 경험)</li>
                <li>• 포부 및 계획 (입사 후 목표와 비전)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 분석 중 페이지
  if (currentStep === 'analysis') {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-primary flex items-center gap-2">
            <Bot className="w-8 h-8" />
            자기소개서 분석 중
          </h1>
          <p className="text-muted-foreground">AI가 자기소개서를 분석하고 있습니다...</p>
        </div>

        <Card className="border-2 rounded-xl p-8">
          <CardContent className="text-center space-y-6">
            <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <div className="space-y-2">
              <h3 className="font-medium">자기소개서를 분석하고 있습니다</h3>
              <p className="text-muted-foreground">잠시만 기다려주세요. 곧 맞춤형 피드백을 제공해드리겠습니다.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 채팅 인터페이스 (기존 코드)
  if (currentStep === 'chat') {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-primary flex items-center gap-2">
            <MessageSquare className="w-8 h-8" />
            자기소개서 AI 피드백
          </h1>
          <p className="text-muted-foreground">AI와 대화하며 자소서를 완성해보세요</p>
        </div>

        {/* AI 초기 피드백 */}
        <Card className="border-2 rounded-xl mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
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
              </ul>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">💡 개선 제안</h4>
              <ul className="text-yellow-800 list-disc list-inside space-y-1">
                <li>지원동기에서 회사의 핵심 가치와 본인의 목표 연결</li>
                <li>첫 문단을 더 임팩트 있게 시작하는 방법 고려</li>
                <li>차별화된 개인적 경험이나 관점 추가</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 채팅 인터페이스 */}
        <Card className="border-2 rounded-xl h-[600px] flex flex-col">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              AI 어시스턴트
            </CardTitle>
            <CardDescription>
              자기소개서에 대해 궁금한 점을 자유롭게 질문해보세요
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'ai' && (
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                </div>
                {message.type === 'user' && (
                  <div className="p-2 bg-primary/10 rounded-full">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                placeholder="자소서에 대해 궁금한 점을 질문해보세요..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* 추천 질문 */}
        <Card className="border-2 rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              추천 질문
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {[
                "첫 번째 문단이 너무 평범한가요?",
                "지원동기를 더 구체적으로 쓰려면 어떻게 해야 하나요?",
                "경험을 어필하는 더 좋은 방법이 있을까요?",
                "전체적인 구성에 문제가 없는지 확인해주세요"
              ].map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto p-3 text-left"
                  onClick={() => {
                    setInputMessage(question);
                    handleSendMessage();
                  }}
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">자기소개서 AI</h1>
        <p className="text-muted-foreground">AI와 함께하는 똑똑한 자소서 작성</p>
      </div>

      {/* 기능 소개 카드 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">자소서 업로드</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              기존 자기소개서를 업로드하면 AI가 맞춤형 피드백을 제공합니다.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">AI 피드백</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              강점이 돋보이도록 글을 다듬는 구체적인 가이드를 받을 수 있습니다.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">예상 질문 생성</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              자소서 내용을 바탕으로 예상 면접 질문을 자동으로 생성합니다.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* 메인 작업 영역 */}
      <Card className="border-2 rounded-xl p-8">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>자기소개서를 업로드해 주세요</CardTitle>
          <CardDescription>
            AI가 당신의 자소서를 분석하여 맞춤형 피드백을 제공합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div 
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onClick={handleFileSelect}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="font-medium mb-2">파일을 드래그하거나 클릭하여 업로드</p>
            <p className="text-sm text-muted-foreground">PDF, DOC, DOCX 파일을 지원합니다 (최대 10MB)</p>
            
            {selectedFile && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm">선택된 파일: <span className="font-medium">{selectedFile.name}</span></p>
                <p className="text-xs text-muted-foreground">크기: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}
          </div>

          {/* 숨겨진 파일 입력 */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="px-8" onClick={handleFileSelect}>
              <Upload className="mr-2 h-4 w-4" />
              파일 선택
            </Button>
            {selectedFile && (
              <Button size="lg" className="px-8" onClick={handleFileUpload}>
                <Bot className="mr-2 h-4 w-4" />
                분석 시작
              </Button>
            )}
            <Button variant="outline" size="lg" className="px-8" onClick={handleDirectWrite}>
              <Edit3 className="mr-2 h-4 w-4" />
              직접 작성하기
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 예시 피드백 */}
      <Card className="border-2 rounded-xl">
        <CardHeader>
          <CardTitle>AI 피드백 예시</CardTitle>
          <CardDescription>실제 AI가 제공하는 피드백의 예시입니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">💡 개선 제안</h4>
            <p className="text-blue-800">
              "도전적인 프로젝트를 수행했습니다" → "6개월간 팀 리더로서 15명의 개발자와 협업하여 
              사용자 만족도를 30% 향상시킨 프로젝트를 성공적으로 완수했습니다"
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">✅ 강점 분석</h4>
            <p className="text-green-800">
              리더십과 협업 능력이 잘 드러나며, 구체적인 성과 지표가 포함되어 설득력이 높습니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
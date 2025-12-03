import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { FileText, Upload, Bot, CheckCircle, Edit3, X, AlertCircle, Save } from "lucide-react";
import { requestResumeFeedback, createIntroduction } from "../api";
import ReactMarkdown from "react-markdown";
import { IntroFeedbackResponse } from "../types/feedback";

export function ResumeAI() {
  const [currentStep, setCurrentStep] = useState<'upload' | 'write' | 'analysis' | 'chat'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [directWriteText, setDirectWriteText] = useState('');
  const [aiResult, setAiResult] = useState<IntroFeedbackResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // 분석 시뮬레이션 후 결과 페이지로 전환
      setTimeout(() => {
        setCurrentStep('chat');
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

  const handleCompleteWrite = async () => {
    const resumeContent = directWriteText.trim();
    
    // 빈 입력 체크
    if (!resumeContent) {
      setError('자기소개서 내용을 입력해주세요.');
      return;
    }

    // userId 가져오기 (없으면 기본값 1 사용)
    const userIdStr = localStorage.getItem('userId');
    const userId = userIdStr ? parseInt(userIdStr, 10) : 1;
    const finalUserId = isNaN(userId) ? 1 : userId;

    // 에러 초기화 및 로딩 시작
    setError('');
    setIsAnalyzing(true);
    setCurrentStep('analysis');

    try {
      // API 호출
      const result = await requestResumeFeedback(finalUserId, resumeContent);
      
      // API 응답 구조 확인을 위한 로그
      console.log('ResumeAI API 응답 전체:', result);
      const responseKeys = Object.keys(result || {});
      console.log('응답 키 목록:', responseKeys);
      
      // 응답 검증 및 상태 저장
      if (result && result.feedback) {
        // 백엔드 응답 구조에 맞게 필드 매핑
        // IntroFeedbackResponse: { userId, feedback, original_resume, regen_resume, regen_toss_resume }
        const mappedResult: IntroFeedbackResponse = {
          userId: result.userId || undefined,
          feedback: result.feedback || '',
          original_resume: result.original_resume || result.originalResume || resumeContent || '',
          regen_resume: result.regen_resume || result.regenResume || '',
          regen_toss_resume: result.regen_toss_resume || result.regenTossResume || ''
        };
        
        console.log('매핑된 결과:', {
          userId: mappedResult.userId || '없음',
          feedback: mappedResult.feedback ? '있음' : '없음',
          original_resume: mappedResult.original_resume ? '있음 (' + mappedResult.original_resume.substring(0, 50) + '...)' : '없음',
          regen_resume: mappedResult.regen_resume ? '있음 (' + mappedResult.regen_resume.substring(0, 50) + '...)' : '없음',
          regen_toss_resume: mappedResult.regen_toss_resume ? '있음 (' + mappedResult.regen_toss_resume.substring(0, 50) + '...)' : '없음'
        });
        
        // 수정된 자기소개서가 없으면 경고
        if (!mappedResult.regen_resume || !mappedResult.regen_resume.trim()) {
          console.warn('수정된 자기소개서 필드를 찾을 수 없습니다. 응답의 모든 키:', responseKeys);
          console.warn('응답 전체 내용:', JSON.stringify(result, null, 2));
        }
        
        setAiResult(mappedResult);
        setCurrentStep('chat');
      } else {
        throw new Error('피드백 응답 형식이 올바르지 않습니다.');
      }
    } catch (err: any) {
      console.error('피드백 요청 실패:', err);
      
      // 에러 메시지를 사용자 친화적으로 처리
      let errorMessage = '피드백을 받는 중 오류가 발생했습니다.';
      
      if (err.message) {
        // HTTP 에러 메시지에서 불필요한 부분 제거
        if (err.message.includes('HTTP error!') || err.message.includes('status:')) {
          // "HTTP error! status: 404, message: Not Found" 같은 메시지를 간단하게
          if (err.message.includes('404')) {
            errorMessage = '서버에서 요청한 경로를 찾을 수 없습니다. 서버 설정을 확인해주세요.';
          } else if (err.message.includes('500')) {
            errorMessage = '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          } else {
            errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          }
        } else if (err.message.includes('연결') || err.message.includes('서버')) {
          errorMessage = err.message;
        } else if (err.message.includes('Failed to fetch')) {
          errorMessage = '서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setCurrentStep('write'); // 에러 시 작성 페이지로 돌아가기
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveIntroduction = async () => {
    const resumeContent = directWriteText.trim();
    
    if (!resumeContent) {
      setError('저장할 자기소개서 내용이 없습니다.');
      return;
    }

    // userId 가져오기 (없으면 기본값 1 사용)
    const userIdStr = localStorage.getItem('userId');
    const userId = userIdStr ? parseInt(userIdStr, 10) : 1;
    const finalUserId = isNaN(userId) ? 1 : userId;

    // jobApplied 값 가져오기 (localStorage의 userProfile에서 targetJob 사용, 없으면 기본값)
    let jobApplied = "네이버 자기소개서"; // 기본값
    try {
      const userProfileStr = localStorage.getItem('userProfile');
      if (userProfileStr) {
        const userProfile = JSON.parse(userProfileStr);
        if (userProfile.targetJob && userProfile.targetJob.trim()) {
          jobApplied = userProfile.targetJob;
        }
      }
    } catch (e) {
      console.warn('userProfile 파싱 실패:', e);
    }

    setIsSaving(true);
    setError('');
    setSaveSuccess(false);

    try {
      // 자기소개서 저장 API 호출
      const response = await createIntroduction({
        userId: finalUserId,
        jobApplied: jobApplied, // 필수 필드이므로 값 설정
        introText: resumeContent
      });

      if (response && response.id) {
        setSaveSuccess(true);
        console.log('자기소개서 저장 성공:', response);
        
        // 1) 자기소개서 저장 완료 시 introduction.id를 localStorage에 저장
        localStorage.setItem("lastIntroductionId", String(response.id));
        
        // 자기소개서 저장 이벤트 발생 (LearningProfile에서 리스닝)
        window.dispatchEvent(new CustomEvent('introductionSaved'));
        
        // 성공 메시지는 3초 후 자동으로 사라지도록
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        throw new Error('저장 응답 형식이 올바르지 않습니다.');
      }
    } catch (err: any) {
      console.error('자기소개서 저장 실패:', err);
      let errorMessage = '자기소개서 저장 중 오류가 발생했습니다.';
      
      if (err.message) {
        if (err.message.includes('HTTP error!') || err.message.includes('status:')) {
          if (err.message.includes('404')) {
            errorMessage = '저장 경로를 찾을 수 없습니다. 서버 설정을 확인해주세요.';
          } else if (err.message.includes('500')) {
            errorMessage = '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          } else {
            errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          }
        } else if (err.message.includes('연결') || err.message.includes('서버')) {
          errorMessage = err.message;
        } else if (err.message.includes('Failed to fetch')) {
          errorMessage = '서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
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
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
            <Textarea
              placeholder="자기소개서를 입력하세요..."
              value={directWriteText}
              onChange={(e) => {
                setDirectWriteText(e.target.value);
                setError(''); // 입력 시 에러 메시지 제거
              }}
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
                  disabled={isAnalyzing}
                >
                  <X className="w-4 h-4 mr-2" />
                  취소
                </Button>
                <Button 
                  onClick={handleCompleteWrite}
                  disabled={!directWriteText.trim() || isAnalyzing}
                  className="px-6"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isAnalyzing ? '분석 중...' : '분석하기'}
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
              <h3 className="font-medium">AI 분석 중입니다...</h3>
              <p className="text-muted-foreground">잠시만 기다려주세요. 곧 맞춤형 피드백을 제공해드리겠습니다.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 분석 결과 페이지 (채팅 기능 제거)
  if (currentStep === 'chat') {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-primary flex items-center gap-2">
            <Bot className="w-8 h-8" />
            자기소개서 AI 피드백
          </h1>
          <p className="text-muted-foreground">AI가 분석한 자기소개서 피드백 결과입니다</p>
        </div>

        {/* AI 분석 결과 */}
        <Card className="border-2 rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              AI 분석 결과
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiResult ? (
              <div className="space-y-6 mt-6">
                {/* 원본 자기소개서 */}
                <section className="border rounded-lg p-4 bg-white shadow-sm">
                  <h2 className="text-lg font-semibold mb-2">📝 원본 자기소개서</h2>
                  <div 
                    className="text-gray-800 whitespace-pre-wrap break-words"
                    style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                  >
                    {aiResult.original_resume && aiResult.original_resume.trim() ? (
                      <ReactMarkdown>{aiResult.original_resume}</ReactMarkdown>
                    ) : (
                      <p className="text-gray-500 italic">원본 자기소개서 내용이 없습니다.</p>
                    )}
                  </div>
                </section>

                {/* AI 피드백 */}
                <section className="border rounded-lg p-4 bg-white shadow-sm">
                  <h2 className="text-lg font-semibold mb-2">💡 AI 피드백</h2>
                  <div 
                    className="prose prose-sm max-w-none text-gray-900"
                    style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                  >
                    {aiResult.feedback && aiResult.feedback.trim() ? (
                      <ReactMarkdown>{aiResult.feedback}</ReactMarkdown>
                    ) : (
                      <p className="text-gray-500 italic">피드백 내용이 없습니다.</p>
                    )}
                  </div>
                </section>

                {/* 개선된 자기소개서 버전 */}
                <section className="border rounded-lg p-4 bg-white shadow-sm">
                  <h2 className="text-lg font-semibold mb-2">✨ 개선된 자기소개서 버전</h2>
                  <div 
                    className="text-gray-800 whitespace-pre-wrap break-words"
                    style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                  >
                    {aiResult.regen_resume && aiResult.regen_resume.trim() ? (
                      <ReactMarkdown>{aiResult.regen_resume}</ReactMarkdown>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-yellow-800 text-sm">
                          개선된 자기소개서가 제공되지 않았습니다. 
                          <br />
                          콘솔을 확인하여 API 응답 구조를 확인해주세요.
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                {/* 토스 인재상 버전 자기소개서 */}
                {aiResult.regen_toss_resume && aiResult.regen_toss_resume.trim() && (
                  <section className="border rounded-lg p-4 bg-white shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">🎯 토스 인재상 버전 자기소개서</h2>
                    <div 
                      className="text-gray-800 whitespace-pre-wrap break-words"
                      style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                    >
                      <ReactMarkdown>{aiResult.regen_toss_resume}</ReactMarkdown>
                    </div>
                  </section>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-600">피드백을 불러오는 중...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 저장 버튼 및 메시지 */}
        <Card className="border-2 rounded-xl">
          <CardContent className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
            {saveSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800 text-sm">자기소개서가 학습 프로필에 저장되었습니다.</p>
              </div>
            )}
            <div className="flex justify-end">
              <Button 
                onClick={handleSaveIntroduction}
                disabled={isSaving || !aiResult || !directWriteText.trim()}
                className="px-6"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? '저장 중...' : '저장하기'}
              </Button>
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

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Award, Building, Loader } from "lucide-react";
import { departments } from "./DepartmentSelector";
import { getRoadmapCert } from "../api";

interface CertificationRoadmapViewProps {
  selectedDepartment: string;
  selectedJob: string;
}

interface Certification {
  name: string;
  organization: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
}

export function CertificationRoadmapView({ selectedDepartment, selectedJob }: CertificationRoadmapViewProps) {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const departmentInfo = departments.find(dept => dept.id === selectedDepartment);

  useEffect(() => {
    const fetchCertifications = async () => {
      if (!selectedDepartment || !selectedJob || !departmentInfo) {
        setCertifications([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // API 호출: 학과명과 직무명을 전달
        console.log('API 호출 시작:', { major: departmentInfo.name, job: selectedJob });
        const data = await getRoadmapCert(departmentInfo.name, selectedJob);
        console.log('API 응답 받음:', data);
        
        // API 응답이 배열인지 확인
        if (!Array.isArray(data)) {
          console.warn('API 응답이 배열이 아닙니다:', data);
          setCertifications([]);
          setError('서버 응답 형식이 올바르지 않습니다.');
          return;
        }
        
        // API 응답을 Certification 형태로 변환
        // API 응답: [{id, roadmapType, major, job, majorName, certName, grade}]
        const transformedCerts: Certification[] = data.map((item: any) => ({
          name: item.certName || item.cert_name || item.certName || '',
          organization: item.organization || item.org || '미정',
          difficulty: 'medium' as const, // API에서 difficulty 정보가 없으면 기본값
          description: item.description || `${item.certName || item.cert_name || ''} 자격증입니다.`
        }));

        setCertifications(transformedCerts);
      } catch (err: any) {
        console.error('자격증 로드맵 조회 실패:', err);
        
        // 에러 타입에 따라 다른 메시지 표시
        let errorMessage = '자격증 데이터를 불러오는데 실패했습니다.';
        
        if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
          errorMessage = '서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요. (Failed to fetch)';
        } else if (err.message?.includes('HTTP error! status: 404')) {
          // 404 에러인 경우 - 해당 전공/직무 조합의 데이터가 없음
          const errorJson = err.message.match(/\{.*\}/)?.[0];
          if (errorJson) {
            try {
              const parsed = JSON.parse(errorJson);
              errorMessage = parsed.message || `해당 전공/직무의 자격증 로드맵 데이터가 서버에 없습니다.\n(전공: ${departmentInfo?.name}, 직무: ${selectedJob})`;
            } catch {
              errorMessage = `해당 전공/직무의 자격증 로드맵 데이터가 서버에 없습니다.\n(전공: ${departmentInfo?.name}, 직무: ${selectedJob})`;
            }
          } else {
            errorMessage = `해당 전공/직무의 자격증 로드맵 데이터가 서버에 없습니다.\n(전공: ${departmentInfo?.name}, 직무: ${selectedJob})`;
          }
        } else if (err.message?.includes('HTTP error')) {
          errorMessage = `서버 오류: ${err.message}`;
        } else {
          errorMessage = err.message || errorMessage;
        }
        
        setError(errorMessage);
        setCertifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertifications();
  }, [selectedDepartment, selectedJob, departmentInfo]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-700 border border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "hard": return "bg-red-100 text-red-700 border border-red-200";
      default: return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "초급";
      case "medium": return "중급";
      case "hard": return "고급";
      default: return "미분류";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-[#051243]">
            <Award className="w-8 h-8 text-[#051243]" />
            자격증 로드맵
          </h1>
          <p className="text-gray-600">
            {departmentInfo?.name} - {selectedJob} 직무 맞춤 자격증 취득 로드맵
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-[#051243]" />
          <span className="ml-2 text-gray-600">데이터를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-[#051243]">
            <Award className="w-8 h-8 text-[#051243]" />
            자격증 로드맵
          </h1>
          <p className="text-gray-600">
            {departmentInfo?.name} - {selectedJob} 직무 맞춤 자격증 취득 로드맵
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-[#051243]">
          <Award className="w-8 h-8 text-[#051243]" />
          자격증 로드맵
        </h1>
        <p className="text-gray-600">
          {departmentInfo?.name} - {selectedJob} 직무 맞춤 자격증 취득 로드맵
        </p>
      </div>

      {/* 자격증 카드 그리드 (3개씩 한 줄) */}
      {certifications.length > 0 ? (
        <div className="grid grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <Card key={index} className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#051243] bg-white h-52 flex flex-col">
              <CardHeader className="pb-2 bg-white rounded-t-xl border-b border-gray-100 flex-shrink-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="p-1.5 bg-gray-50 rounded-lg flex-shrink-0">
                      <Award className="w-3.5 h-3.5 text-[#051243]" />
                    </div>
                    <CardTitle className="text-sm font-semibold text-[#051243] leading-tight break-words hyphens-auto" style={{wordBreak: 'keep-all', overflowWrap: 'break-word'}}>
                      {cert.name}
                    </CardTitle>
                  </div>
                  <Badge className={`${getDifficultyColor(cert.difficulty)} rounded-full px-1.5 py-0.5 text-xs font-medium whitespace-nowrap flex-shrink-0`}>
                    {getDifficultyLabel(cert.difficulty)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-2 pb-3 flex flex-col justify-between flex-1 min-h-0">
                <CardDescription className="text-gray-600 leading-tight text-xs overflow-hidden mb-2 flex-1" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', wordBreak: 'keep-all', overflowWrap: 'break-word'}}>
                  {cert.description}
                </CardDescription>
                
                <div className="space-y-1.5 mt-auto flex-shrink-0">
                  <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded-lg">
                    <Building className="w-3.5 h-3.5 text-[#051243] flex-shrink-0" />
                    <span className="text-xs font-medium text-[#051243] truncate" title={cert.organization}>{cert.organization}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          추천 자격증이 없습니다.
        </div>
      )}
    </div>
  );
}
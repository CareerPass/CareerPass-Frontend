import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { BookOpen, Star, Loader } from "lucide-react";
import { departments } from "./DepartmentSelector";
import { getRoadmapMajor } from "../api";

interface SubjectRoadmapViewProps {
  selectedDepartment: string;
}

interface Subject {
  majorName: string;
  job: string;
  description: string;
  credits: string;
  grade: number;
}

interface YearData {
  subjects: Subject[];
}

export function SubjectRoadmapView({ selectedDepartment }: SubjectRoadmapViewProps) {
  const [subjectsData, setSubjectsData] = useState<Record<string, YearData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const departmentInfo = departments.find(dept => dept.id === selectedDepartment);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedDepartment || !departmentInfo) {
        setSubjectsData({});
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // API 호출: 학과명만 전달 (job 없이)
        console.log('API 호출 시작:', { major: departmentInfo.name });
        const data = await getRoadmapMajor(departmentInfo.name);
        console.log('API 응답 받음:', data);
        
        // API 응답이 배열인지 확인
        if (!Array.isArray(data)) {
          console.warn('API 응답이 배열이 아닙니다:', data);
          setSubjectsData({});
          setError('서버 응답 형식이 올바르지 않습니다.');
          return;
        }
        
        // API 응답을 학년별로 그룹화
        // API 응답: [{id, roadmapType, major, job, majorName, subjectName, grade}]
        const groupedByGrade: Record<string, YearData> = {};
        
        data.forEach((item: any) => {
          // roadmapType이 'MAJOR'인 경우만 처리 (교과목 로드맵)
          if (item.roadmapType !== 'MAJOR') {
            return;
          }
          
          const grade = item.grade || 1; // grade가 없으면 1학년으로 처리
          const yearKey = `${grade}학년`;
          
          if (!groupedByGrade[yearKey]) {
            groupedByGrade[yearKey] = { subjects: [] };
          }
          
          // API 응답을 Subject 형태로 변환
          // majorName이 카드 제목, job이 태그
          groupedByGrade[yearKey].subjects.push({
            majorName: item.majorName || item.major_name || item.subjectName || '',
            job: item.job || '',
            description: item.description || '',
            credits: item.credits || item.credit || '3', // 기본값 3학점
            grade: grade
          });
        });

        setSubjectsData(groupedByGrade);
      } catch (err: any) {
        console.error('교과목 로드맵 조회 실패:', err);
        
        // 에러 타입에 따라 다른 메시지 표시
        let errorMessage = '교과목 데이터를 불러오는데 실패했습니다.';
        
        if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
          errorMessage = '서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.';
        } else if (err.message?.includes('HTTP error! status: 404')) {
          // 404 에러인 경우 - 데이터가 없거나 전공명이 일치하지 않음
          errorMessage = `해당 전공의 교과목 로드맵 데이터가 서버에 없습니다.\n\n전공명: "${departmentInfo?.name}"\n\n백엔드에 이 전공명으로 데이터가 등록되어 있는지 확인해주세요.`;
          // 에러는 표시하지만 빈 데이터로 설정하여 UI가 깨지지 않도록 함
          setSubjectsData({});
        } else if (err.message?.includes('HTTP error')) {
          errorMessage = `서버 오류: ${err.message}`;
        } else {
          errorMessage = err.message || errorMessage;
        }
        
        setError(errorMessage);
        // 404가 아닌 경우에만 빈 데이터 설정 (404는 위에서 이미 설정)
        if (!err.message?.includes('HTTP error! status: 404')) {
          setSubjectsData({});
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, [selectedDepartment, departmentInfo]);

  const getJobBadgeColor = () => {
    return "bg-blue-100 text-blue-700 border border-blue-200";
  };

  const years = ["1학년", "2학년", "3학년", "4학년"];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-[#051243]">
            <BookOpen className="w-8 h-8 text-[#051243]" />
            교과목 로드맵
          </h1>
          <p className="text-gray-600">
            {departmentInfo?.name} 교과목 로드맵
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
            <BookOpen className="w-8 h-8 text-[#051243]" />
            교과목 로드맵
          </h1>
          <p className="text-gray-600">
            {departmentInfo?.name} 교과목 로드맵
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
          <BookOpen className="w-8 h-8 text-[#051243]" />
          교과목 로드맵
        </h1>
        <p className="text-gray-600">
          {departmentInfo?.name} 교과목 로드맵
        </p>
      </div>

      {years.map((year) => {
        const yearData = subjectsData[year];
        if (!yearData || !yearData.subjects || yearData.subjects.length === 0) {
          return null;
        }

        return (
          <div key={year} className="space-y-4">
            {/* 학년 헤더 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-200/50 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold shadow-lg">
                  {year.charAt(0)}
                </div>
                <h2 className="text-xl font-semibold text-[#051243]">{year}</h2>
              </div>
            </div>

            {/* 교과목 카드 그리드 (3개씩 한 줄) */}
            <div className="grid grid-cols-3 gap-6">
              {yearData.subjects.map((subject, index) => (
                <Card key={`${subject.majorName}-${subject.job}-${index}`} className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#051243] bg-white h-48 flex flex-col">
                  <CardHeader className="pb-2 bg-white rounded-t-xl border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="p-1.5 bg-gray-50 rounded-lg flex-shrink-0">
                          <BookOpen className="w-3.5 h-3.5 text-[#051243]" />
                        </div>
                        <CardTitle className="text-sm font-semibold text-[#051243] leading-tight break-words hyphens-auto" style={{wordBreak: 'keep-all', overflowWrap: 'break-word'}}>
                          {subject.majorName}
                        </CardTitle>
                      </div>
                      {subject.job && (
                        <Badge className={`${getJobBadgeColor()} rounded-full px-1.5 py-0.5 text-xs font-medium whitespace-nowrap flex-shrink-0`}>
                          {subject.job}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2 pb-3 flex flex-col justify-between flex-1 min-h-0">
                    {subject.description && (
                      <CardDescription className="text-gray-600 leading-tight text-xs overflow-hidden mb-2 flex-1" style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', wordBreak: 'keep-all', overflowWrap: 'break-word'}}>
                        {subject.description}
                      </CardDescription>
                    )}
                    
                    <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded-lg mt-auto flex-shrink-0">
                      <Star className="w-3.5 h-3.5 text-[#051243]" />
                      <span className="text-xs font-medium text-[#051243]">{subject.credits}학점</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
      
      {Object.keys(subjectsData).length === 0 && !isLoading && !error && (
        <div className="text-center py-12 text-muted-foreground">
          교과목 데이터가 없습니다.
        </div>
      )}
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Award, Building, TrendingUp, CheckCircle } from "lucide-react";
import { roadmapData } from "./roadmapData";
import { departments } from "./DepartmentSelector";

interface CertificationRoadmapViewProps {
  selectedDepartment: string;
  selectedJob: string;
}

export function CertificationRoadmapView({ selectedDepartment, selectedJob }: CertificationRoadmapViewProps) {
  const jobData = roadmapData[selectedDepartment]?.[selectedJob];
  const departmentInfo = departments.find(dept => dept.id === selectedDepartment);

  if (!jobData) {
    return <div>데이터를 찾을 수 없습니다.</div>;
  }

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

  const getYearColor = (year: string) => {
    switch (year) {
      case "1학년": return "text-blue-600";
      case "2학년": return "text-green-600";
      case "3학년": return "text-orange-600";
      case "4학년": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  // 모든 자격증을 수집
  const allCertifications = Object.entries(jobData).flatMap(([year, data]) => 
    data.certifications.map(cert => ({ ...cert, year }))
  );

  const years = ["1학년", "2학년", "3학년", "4학년"];

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



      {/* 학년별 자격증 추천 */}
      {years.map((year) => {
        const yearData = jobData[year];
        if (!yearData || !yearData.certifications || yearData.certifications.length === 0) {
          return null;
        }

        return (
          <div key={year} className="space-y-4">
            {/* 학년 헤더 */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-200/50 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold shadow-lg">
                  {year.charAt(0)}
                </div>
                <h2 className="text-xl font-semibold text-[#051243]">{year} 추천 자격증</h2>
              </div>
            </div>

            {/* 자격증 카드 그리드 (3개씩 한 줄) */}
            <div className="grid grid-cols-3 gap-6">
              {yearData.certifications.map((cert, index) => (
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
                      
                      <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-600 flex-shrink-0">추천:</span>
                        <span className="text-xs font-semibold text-[#051243]">
                          {year}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { BookOpen, Star } from "lucide-react";
import { roadmapData } from "./roadmapData";
import { departments } from "./DepartmentSelector";

interface SubjectRoadmapViewProps {
  selectedDepartment: string;
  selectedJob: string;
}

export function SubjectRoadmapView({ selectedDepartment, selectedJob }: SubjectRoadmapViewProps) {
  const jobData = roadmapData[selectedDepartment]?.[selectedJob];
  const departmentInfo = departments.find(dept => dept.id === selectedDepartment);

  if (!jobData) {
    return <div>데이터를 찾을 수 없습니다.</div>;
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high": return "bg-red-100 text-red-700 border border-red-200";
      case "medium": return "bg-orange-100 text-orange-700 border border-orange-200";
      case "low": return "bg-gray-100 text-gray-700 border border-gray-200";
      default: return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getImportanceLabel = (importance: string) => {
    switch (importance) {
      case "high": return "필수";
      case "medium": return "권장";
      case "low": return "선택";
      default: return "선택";
    }
  };

  const years = ["1학년", "2학년", "3학년", "4학년"];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-[#051243]">
          <BookOpen className="w-8 h-8 text-[#051243]" />
          교과목 로드맵
        </h1>
        <p className="text-gray-600">
          {departmentInfo?.name} - {selectedJob} 직무 맞춤 교과목 로드맵
        </p>
      </div>

      {years.map((year) => {
        const yearData = jobData[year];
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
                <Card key={index} className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#051243] bg-white h-48 flex flex-col">
                  <CardHeader className="pb-2 bg-white rounded-t-xl border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="p-1.5 bg-gray-50 rounded-lg flex-shrink-0">
                          <BookOpen className="w-3.5 h-3.5 text-[#051243]" />
                        </div>
                        <CardTitle className="text-sm font-semibold text-[#051243] leading-tight break-words hyphens-auto" style={{wordBreak: 'keep-all', overflowWrap: 'break-word'}}>
                          {subject.name}
                        </CardTitle>
                      </div>
                      <Badge className={`${getImportanceColor(subject.importance)} rounded-full px-1.5 py-0.5 text-xs font-medium whitespace-nowrap flex-shrink-0`}>
                        {getImportanceLabel(subject.importance)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2 pb-3 flex flex-col justify-between flex-1 min-h-0">
                    <CardDescription className="text-gray-600 leading-tight text-xs overflow-hidden mb-2 flex-1" style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', wordBreak: 'keep-all', overflowWrap: 'break-word'}}>
                      {subject.description}
                    </CardDescription>
                    
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
    </div>
  );
}
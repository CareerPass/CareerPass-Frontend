import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { YearSection } from "./YearSection";
import { roadmapData } from "./roadmapData";
import { BookOpen, Award, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface RoadmapViewProps {
  selectedDepartment: string;
  selectedJob: string;
}

export function RoadmapView({ selectedDepartment, selectedJob }: RoadmapViewProps) {
  const departmentData = roadmapData[selectedDepartment];
  
  if (!departmentData || !departmentData[selectedJob]) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          선택하신 학과와 직무에 대한 로드맵 데이터가 아직 준비되지 않았습니다.
          다른 학과나 직무를 선택해보세요.
        </AlertDescription>
      </Alert>
    );
  }

  const jobData = departmentData[selectedJob];
  const years = Object.keys(jobData).sort();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-primary">{selectedJob} 로드맵</h2>
        <p className="text-muted-foreground">
          체계적인 학습을 통해 전문가로 성장하세요
        </p>
      </div>

      <Tabs defaultValue="subjects" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="subjects" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            교과목 로드맵
          </TabsTrigger>
          <TabsTrigger value="certifications" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            자격증 로드맵
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="subjects" className="space-y-8 mt-6">
          {years.map((year) => (
            <YearSection
              key={`subjects-${year}`}
              year={year}
              data={jobData[year]}
              type="subjects"
            />
          ))}
        </TabsContent>
        
        <TabsContent value="certifications" className="space-y-8 mt-6">
          {years.map((year) => (
            <YearSection
              key={`certifications-${year}`}
              year={year}
              data={jobData[year]}
              type="certifications"
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
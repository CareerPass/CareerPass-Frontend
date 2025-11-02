import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Subject } from "./roadmapData";
import { BookOpen, Star } from "lucide-react";

interface SubjectCardProps {
  subject: Subject;
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const importanceColors = {
    high: "bg-red-50 text-red-700 border-red-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200", 
    low: "bg-emerald-50 text-emerald-700 border-emerald-200"
  };

  const importanceLabels = {
    high: "필수",
    medium: "권장",
    low: "선택"
  };

  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            {subject.name}
          </CardTitle>
          <Badge className={importanceColors[subject.importance]}>
            {importanceLabels[subject.importance]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-muted-foreground">{subject.description}</p>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-blue-500" />
            <span className="font-medium">{subject.credits}학점</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
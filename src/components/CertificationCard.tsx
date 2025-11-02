import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Certification } from "./roadmapData";
import { Award, Building } from "lucide-react";

interface CertificationCardProps {
  certification: Certification;
}

export function CertificationCard({ certification }: CertificationCardProps) {
  const difficultyColors = {
    easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    hard: "bg-red-50 text-red-700 border-red-200"
  };

  const difficultyLabels = {
    easy: "초급",
    medium: "중급",
    hard: "고급"
  };

  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            {certification.name}
          </CardTitle>
          <Badge className={difficultyColors[certification.difficulty]}>
            {difficultyLabels[certification.difficulty]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-muted-foreground">{certification.description}</p>
          <div className="flex items-center gap-1">
            <Building className="w-4 h-4 text-blue-500" />
            <span className="text-sm">{certification.organization}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
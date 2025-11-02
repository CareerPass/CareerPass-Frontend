import { YearData } from "./roadmapData";
import { SubjectCard } from "./SubjectCard";
import { CertificationCard } from "./CertificationCard";

interface YearSectionProps {
  year: string;
  data: YearData;
  type: 'subjects' | 'certifications';
}

export function YearSection({ year, data, type }: YearSectionProps) {
  const items = type === 'subjects' ? data.subjects : data.certifications;
  
  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 p-4 bg-[#051243]/8 rounded-lg border border-[#051243]/15">
          <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
            {year.charAt(0)}
          </span>
          <span className="text-primary">{year}</span>
        </h3>
        <div className="text-muted-foreground text-center py-8">
          해당 학년에 대한 데이터가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 p-4 bg-[#051243]/8 rounded-lg border border-[#051243]/15">
        <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
          {year.charAt(0)}
        </span>
        <span className="text-primary">{year}</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {type === 'subjects' 
          ? data.subjects.map((subject, index) => (
              <SubjectCard key={`${subject.name}-${index}`} subject={subject} />
            ))
          : data.certifications.map((cert, index) => (
              <CertificationCard key={`${cert.name}-${index}`} certification={cert} />
            ))
        }
      </div>
    </div>
  );
}
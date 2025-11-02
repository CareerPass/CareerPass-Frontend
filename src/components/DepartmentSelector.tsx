import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Department {
  id: string;
  name: string;
  jobs: string[];
}

export const departments: Department[] = [
  {
    id: "computer-science",
    name: "컴퓨터공학과",
    jobs: ["백엔드 개발자", "프론트엔드 개발자", "데이터 사이언티스트", "AI 엔지니어"]
  },
  {
    id: "business",
    name: "경영학과",
    jobs: ["기획자", "마케팅 전문가", "데이터 분석가", "컨설턴트"]
  },
  {
    id: "design",
    name: "디자인학과",
    jobs: ["UI/UX 디자이너", "그래픽 디자이너", "웹 디자이너", "브랜드 디자이너"]
  },
  {
    id: "mechanical",
    name: "기계공학과",
    jobs: ["설계 엔지니어", "품질관리 전문가", "생산기술 엔지니어", "연구개발자"]
  }
];

interface DepartmentSelectorProps {
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
}

export function DepartmentSelector({ selectedDepartment, onDepartmentChange }: DepartmentSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block">학과 선택</label>
      <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="학과를 선택해주세요" />
        </SelectTrigger>
        <SelectContent>
          {departments.map((dept) => (
            <SelectItem key={dept.id} value={dept.id}>
              {dept.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
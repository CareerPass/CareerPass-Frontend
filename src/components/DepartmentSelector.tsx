import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { departments, Department } from "../data/departmentJobData";

export type { Department };
export { departments };

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
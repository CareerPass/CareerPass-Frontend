import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface JobSelectorProps {
  jobs: string[];
  selectedJob: string;
  onJobChange: (job: string) => void;
}

export function JobSelector({ jobs, selectedJob, onJobChange }: JobSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block">직무 선택</label>
      <Select value={selectedJob} onValueChange={onJobChange}>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="직무를 선택해주세요" />
        </SelectTrigger>
        <SelectContent>
          {jobs.map((job) => (
            <SelectItem key={job} value={job}>
              {job}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
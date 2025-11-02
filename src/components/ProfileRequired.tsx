import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { User, ArrowRight } from "lucide-react";

interface ProfileRequiredProps {
  onGoToProfile: () => void;
}

export function ProfileRequired({ onGoToProfile }: ProfileRequiredProps) {
  return (
    <div className="min-h-screen bg-[#F6F8FB] flex items-center justify-center p-8">
      <Card className="max-w-md w-full p-12 text-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-20 h-20 bg-[#051243]/10 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-[#051243]" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-[#051243]">학습 프로필 설정이 필요합니다</h2>
            <p className="text-muted-foreground">
              CareerPass를 이용하시려면 먼저 학습 프로필을 설정해주세요.
            </p>
          </div>

          <Button
            onClick={onGoToProfile}
            className="bg-[#051243] hover:bg-[#051243]/90 w-full"
          >
            학습 프로필 설정하기
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

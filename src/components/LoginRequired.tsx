import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Lock, ArrowLeft } from "lucide-react";

interface LoginRequiredProps {
  onBackToMain: () => void;
}

export function LoginRequired({ onBackToMain }: LoginRequiredProps) {
  return (
    <div className="min-h-screen bg-[#F6F8FB] flex items-center justify-center p-8">
      <Card className="max-w-md w-full p-12 text-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-20 h-20 bg-[#051243]/10 rounded-full flex items-center justify-center">
            <Lock className="w-10 h-10 text-[#051243]" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-[#051243]">로그인이 필요합니다</h2>
            <p className="text-muted-foreground">
              이 페이지를 이용하시려면 로그인이 필요합니다.
            </p>
          </div>

          <Button
            onClick={onBackToMain}
            className="bg-[#051243] hover:bg-[#051243]/90 w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            메인으로 돌아가기
          </Button>
        </div>
      </Card>
    </div>
  );
}

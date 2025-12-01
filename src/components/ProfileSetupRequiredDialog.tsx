import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { User, X } from "lucide-react";

interface ProfileSetupRequiredDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToProfile: () => void;
}

export function ProfileSetupRequiredDialog({
  isOpen,
  onClose,
  onGoToProfile
}: ProfileSetupRequiredDialogProps) {
  if (!isOpen) return null;

  const handleGoToProfile = () => {
    onGoToProfile();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-2 rounded-xl bg-white shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              학습프로필을 먼저 설정해주세요
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            취업 로드맵, 자기소개서, 모의 면접 기능을 이용하려면 학습프로필(이름·전공·목표 직무)을 먼저 등록해야 합니다.
          </p>
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleGoToProfile} 
              className="flex-1"
            >
              학습프로필 설정하기
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              취소
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}





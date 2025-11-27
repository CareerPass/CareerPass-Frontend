import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  MapPin, 
  Calendar,
  Settings,
  Edit2,
  Save
} from "lucide-react";
import { getUserById, updateUserProfile } from "../api";

export function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    id: null as number | null,
    name: "",
    email: "",
    studentId: "",
    department: "",
    currentYear: "",
    targetJob: "",
    interests: [] as string[]
  });

  // 컴포넌트 마운트 시 사용자 정보 조회
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError("로그인이 필요합니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // GET: 특정 사용자 조회
        const userData = await getUserById(parseInt(userId));
        
        setProfile({
          id: userData.id,
          name: userData.name || "",
          email: userData.email || "",
          studentId: userData.studentId || "",
          department: userData.department || "",
          currentYear: userData.currentYear || "",
          targetJob: userData.targetJob || "",
          interests: userData.interests || []
        });
      } catch (err: any) {
        console.error("사용자 정보 조회 실패:", err);
        setError(err.message || "사용자 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const achievements = [
    { title: "정보처리산업기사", date: "2024.12", type: "자격증" },
    { title: "ITQ 한글/파워포인트", date: "2024.03", type: "자격증" },
    { title: "데이터베이스 A+", date: "2024.12", type: "교과목" },
    { title: "객체지향프로그래밍 A", date: "2024.06", type: "교과목" }
  ];

  const handleSave = async () => {
    const userId = profile.id || localStorage.getItem('userId');
    if (!userId) {
      setError("사용자 ID가 없습니다.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      
      // PATCH: 사용자 프로필 업데이트
      await updateUserProfile(parseInt(userId.toString()), {
        name: profile.name,
        email: profile.email,
        studentId: profile.studentId,
        department: profile.department,
        currentYear: profile.currentYear,
        targetJob: profile.targetJob,
        interests: profile.interests
      });
      
      setIsEditing(false);
    } catch (err: any) {
      console.error("프로필 저장 실패:", err);
      setError(err.message || "프로필 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-primary">프로필</h1>
        <p className="text-muted-foreground">
          개인 정보와 학습 현황을 관리하세요
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                기본 정보
              </CardTitle>
              <Button
                variant={isEditing ? "default" : "outline"}
                size="sm"
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                disabled={isSaving}
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "저장 중..." : "저장"}
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4 mr-2" />
                    편집
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="text-lg">
                  {profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>이름</Label>
                    {isEditing ? (
                      <Input 
                        value={profile.name} 
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                      />
                    ) : (
                      <p className="font-medium">{profile.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>학번</Label>
                    {isEditing ? (
                      <Input 
                        value={profile.studentId} 
                        onChange={(e) => setProfile({...profile, studentId: e.target.value})}
                      />
                    ) : (
                      <p className="font-medium">{profile.studentId}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>이메일</Label>
                    {isEditing ? (
                      <Input 
                        value={profile.email} 
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                      />
                    ) : (
                      <p className="font-medium">{profile.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>현재 학년</Label>
                    {isEditing ? (
                      <Input 
                        value={profile.currentYear} 
                        onChange={(e) => setProfile({...profile, currentYear: e.target.value})}
                      />
                    ) : (
                      <p className="font-medium">{profile.currentYear}</p>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{profile.department}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                    <span>목표 직무: {profile.targetJob}</span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                    <div className="flex flex-wrap gap-1">
                      {profile.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              학습 통계
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-blue-600">이수 교과목</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="text-2xl font-bold text-emerald-600">3</div>
                <div className="text-sm text-emerald-600">취득 자격증</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">50%</div>
                <div className="text-sm text-purple-600">전체 진도</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            성취 기록
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                <div className={`p-2 rounded-full ${
                  achievement.type === '자격증' 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {achievement.type === '자격증' ? (
                    <GraduationCap className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{achievement.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {achievement.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {achievement.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
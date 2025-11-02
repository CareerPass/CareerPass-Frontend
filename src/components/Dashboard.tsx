import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { 
  TrendingUp, 
  BookOpen, 
  Award, 
  Target,
  CheckCircle2,
  Clock,
  Star
} from "lucide-react";

export function Dashboard() {
  const stats = [
    {
      label: "이수 교과목",
      value: "12",
      total: "48",
      percentage: 25,
      icon: BookOpen,
      color: "text-blue-600"
    },
    {
      label: "취득 자격증",
      value: "3",
      total: "12", 
      percentage: 25,
      icon: Award,
      color: "text-emerald-600"
    },
    {
      label: "전체 진도",
      value: "2학년",
      total: "4학년",
      percentage: 50,
      icon: Target,
      color: "text-purple-600"
    }
  ];

  const recentAchievements = [
    {
      title: "정보처리산업기사 취득",
      date: "2024.12.15",
      type: "자격증",
      status: "completed"
    },
    {
      title: "데이터베이스 수강 완료",
      date: "2024.12.10", 
      type: "교과목",
      status: "completed"
    },
    {
      title: "웹프로그래밍 수강 중",
      date: "진행중",
      type: "교과목", 
      status: "in-progress"
    }
  ];

  const upcomingGoals = [
    {
      title: "SQLD 자격증 준비",
      deadline: "2025.02.15",
      priority: "high"
    },
    {
      title: "소프트웨어공학 수강",
      deadline: "2025.03.01",
      priority: "medium"
    },
    {
      title: "알고리즘 스터디 참여",
      deadline: "2025.01.30",
      priority: "low"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-primary">대시보드</h1>
        <p className="text-muted-foreground">
          학습 진도와 목표 달성 현황을 한눈에 확인하세요
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    <span className="text-muted-foreground">/ {stat.total}</span>
                  </div>
                  <Progress value={stat.percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {stat.percentage}% 완료
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              최근 성취
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className={`p-2 rounded-full ${
                    achievement.status === 'completed' 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {achievement.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{achievement.title}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
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

        {/* Upcoming Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              다가오는 목표
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingGoals.map((goal, index) => {
                const priorityColors = {
                  high: "bg-red-100 text-red-700 border-red-200",
                  medium: "bg-yellow-100 text-yellow-700 border-yellow-200", 
                  low: "bg-green-100 text-green-700 border-green-200"
                };

                const priorityLabels = {
                  high: "높음",
                  medium: "보통",
                  low: "낮음"
                };

                return (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Star className="w-4 h-4 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium">{goal.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          className={`text-xs ${priorityColors[goal.priority]}`}
                        >
                          {priorityLabels[goal.priority]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          마감: {goal.deadline}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
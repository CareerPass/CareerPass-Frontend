// 학과 및 직무 데이터
export interface Department {
  id: string;
  name: string;
  jobs: string[];
}

export const departments: Department[] = [
  {
    id: "computer-science",
    name: "컴퓨터공학과",
    jobs: [
      "데이터 베이스 개발자",
      "시스템소프트웨어 개발자",
      "컴퓨터시스템설계 분석가",
      "모바일앱 개발자",
      "컴퓨터하드웨어 기술자",
      "네트워크 관리자",
      "웹 기획자",
      "IT기술지원 전문가",
      "정보통신 컨설턴트",
      "웹 디자이너"
    ]
  },
  {
    id: "information-communication",
    name: "정보통신공학과",
    jobs: [
      "데이터베이스 개발자",
      "시스템소프트웨어 개발자",
      "모바일앱 개발자",
      "게임프로그래머",
      "네트워크 관리자",
      "정보시스템 운영자",
      "방송송출 장비기사",
      "컴퓨터하드웨어 기술자/연구원",
      "가상현실 전문가",
      "통신기기/장비기술자",
      "지리정보시스템 전문가",
      "디지털영상처리 전문가"
    ]
  },
  {
    id: "semiconductor",
    name: "반도체공학과",
    jobs: [
      "통신기술 개발자",
      "반도체공학기술자 및 연구원",
      "항공공학 기술자",
      "로봇공학 기술자",
      "응용 소프트웨어 개발자",
      "금속/재료공학 기술자",
      "전자기기/제품개발기술자 및 연구원",
      "전자제품 및 부품 개발기술자",
      "컴퓨터하드웨어기술자 및 연구원"
    ]
  },
  {
    id: "industrial-management",
    name: "산업경영공학과",
    jobs: ["데이터 없음"]
  },
  {
    id: "electrical",
    name: "전기공학과",
    jobs: ["데이터 없음"]
  },
  {
    id: "electronics",
    name: "전자공학과",
    jobs: ["데이터 없음"]
  }
];

// InterviewAI 컴포넌트용 학과 옵션 (학과명만)
export const MAJOR_OPTIONS = departments.map(dept => dept.name);

// InterviewAI 컴포넌트용 직무 옵션 (학과별로 동적으로 가져오기)
export const getJobOptionsByMajor = (majorName: string): string[] => {
  const department = departments.find(dept => dept.name === majorName);
  return department ? department.jobs : [];
};


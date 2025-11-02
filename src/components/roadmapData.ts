export interface Subject {
  name: string;
  credits: number;
  description: string;
  importance: 'high' | 'medium' | 'low';
}

export interface Certification {
  name: string;
  organization: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
}

export interface YearData {
  subjects: Subject[];
  certifications: Certification[];
}

export interface RoadmapData {
  [departmentId: string]: {
    [jobTitle: string]: {
      [year: string]: YearData;
    };
  };
}

export const roadmapData: RoadmapData = {
  "computer-science": {
    "백엔드 개발자": {
      "1학년": {
        subjects: [
          { name: "컴퓨터과학개론", credits: 3, description: "컴퓨터과학 기초 이론", importance: "high" },
          { name: "프로그래밍기초", credits: 3, description: "Python/C 기초 프로그래밍", importance: "high" },
          { name: "이산수학", credits: 3, description: "논리와 집합론 기초", importance: "medium" },
          { name: "선형대수", credits: 3, description: "벡터와 행렬 연산", importance: "medium" }
        ],
        certifications: [
          { name: "정보처리기능사", organization: "한국산업인력공단", difficulty: "easy", description: "컴퓨터 기초 자격증" },
          { name: "ITQ 한글", organization: "한국생산성본부", difficulty: "easy", description: "사무 소프트웨어 활용" }
        ]
      },
      "2학년": {
        subjects: [
          { name: "자료구조", credits: 3, description: "배열, 리스트, 트리 등 자료구조", importance: "high" },
          { name: "객체지향프로그래밍", credits: 3, description: "Java/C++ 객체지향 프로그래밍", importance: "high" },
          { name: "컴퓨터구조", credits: 3, description: "CPU, 메모리, 시스템 구조", importance: "medium" },
          { name: "운영체제", credits: 3, description: "프로세스, 메모리, 파일 시스템", importance: "high" }
        ],
        certifications: [
          { name: "정보처리산업기사", organization: "한국산업인력공단", difficulty: "medium", description: "정보처리 중급 자격증" },
          { name: "SQLD", organization: "한국데이터산업진흥원", difficulty: "medium", description: "SQL 개발자 자격증" }
        ]
      },
      "3학년": {
        subjects: [
          { name: "데이터베이스", credits: 3, description: "관계형 데이터베이스 설계", importance: "high" },
          { name: "소프트웨어공학", credits: 3, description: "개발 방법론과 프로젝트 관리", importance: "high" },
          { name: "네트워크프로그래밍", credits: 3, description: "TCP/IP, HTTP 프로토콜", importance: "high" },
          { name: "알고리즘", credits: 3, description: "정렬, 탐색, 동적계획법", importance: "high" }
        ],
        certifications: [
          { name: "정보처리기사", organization: "한국산업인력공단", difficulty: "medium", description: "정보처리 고급 자격증" },
          { name: "OCP(Oracle Certified Professional)", organization: "Oracle", difficulty: "hard", description: "오라클 데이터베이스 전문가" }
        ]
      },
      "4학년": {
        subjects: [
          { name: "웹프로그래밍", credits: 3, description: "Spring, Node.js 웹 개발", importance: "high" },
          { name: "클라우드컴퓨팅", credits: 3, description: "AWS, Docker, Kubernetes", importance: "high" },
          { name: "졸업프로젝트", credits: 6, description: "포트폴리오 제작", importance: "high" },
          { name: "보안프로그래밍", credits: 3, description: "웹 보안과 인증", importance: "medium" }
        ],
        certifications: [
          { name: "AWS Solutions Architect", organization: "Amazon", difficulty: "hard", description: "AWS 클라우드 아키텍트" },
          { name: "정보보안기사", organization: "한국인터넷진흥원", difficulty: "hard", description: "정보보안 전문가" }
        ]
      }
    },
    "프론트엔드 개발자": {
      "1학년": {
        subjects: [
          { name: "컴퓨터과학개론", credits: 3, description: "컴퓨터과학 기초 이론", importance: "high" },
          { name: "프로그래밍기초", credits: 3, description: "Python/JavaScript 기초", importance: "high" },
          { name: "웹디자인기초", credits: 3, description: "HTML, CSS 기초", importance: "high" },
          { name: "멀티미디어개론", credits: 3, description: "디지털 콘텐츠 기초", importance: "medium" }
        ],
        certifications: [
          { name: "웹디자인기능사", organization: "한국산업인력공단", difficulty: "easy", description: "웹 디자인 기초 자격증" },
          { name: "GTQ(그래픽기술자격)", organization: "한국생산성본부", difficulty: "easy", description: "포토샵 활용 능력" }
        ]
      },
      "2학년": {
        subjects: [
          { name: "자바스크립트프로그래밍", credits: 3, description: "ES6+ JavaScript 심화", importance: "high" },
          { name: "반응형웹디자인", credits: 3, description: "Bootstrap, CSS Grid/Flexbox", importance: "high" },
          { name: "UI/UX디자인", credits: 3, description: "사용자 인터페이스 설계", importance: "high" },
          { name: "자료구조", credits: 3, description: "배열, 리스트, 해시 테이블", importance: "medium" }
        ],
        certifications: [
          { name: "정보처리산업기사", organization: "한국산업인력공단", difficulty: "medium", description: "정보처리 중급 자격증" },
          { name: "Adobe Certified Expert", organization: "Adobe", difficulty: "medium", description: "어도비 소프트웨어 전문가" }
        ]
      },
      "3학년": {
        subjects: [
          { name: "프론트엔드프레임워크", credits: 3, description: "React, Vue.js 프레임워크", importance: "high" },
          { name: "모바일웹프로그래밍", credits: 3, description: "PWA, React Native", importance: "high" },
          { name: "웹성능최적화", credits: 3, description: "번들링, 캐싱, 이미지 최적화", importance: "high" },
          { name: "인터렉션디자인", credits: 3, description: "애니메이션과 사용자 경험", importance: "medium" }
        ],
        certifications: [
          { name: "Google UX Design Certificate", organization: "Google", difficulty: "medium", description: "구글 UX 디자인 인증" },
          { name: "정보처리기사", organization: "한국산업인력공단", difficulty: "medium", description: "정보처리 고급 자격증" }
        ]
      },
      "4학년": {
        subjects: [
          { name: "고급웹개발", credits: 3, description: "Next.js, TypeScript", importance: "high" },
          { name: "웹접근성", credits: 3, description: "WCAG 가이드라인과 접근성", importance: "medium" },
          { name: "졸업프로젝트", credits: 6, description: "포트폴리오 제작", importance: "high" },
          { name: "협업도구활용", credits: 3, description: "Git, Figma, Jira 활용", importance: "high" }
        ],
        certifications: [
          { name: "Google Analytics Certified", organization: "Google", difficulty: "medium", description: "웹 분석 전문가" },
          { name: "Certified Kubernetes Administrator", organization: "CNCF", difficulty: "hard", description: "컨테이너 오케스트레이션 전문가" }
        ]
      }
    }
  },
  "business": {
    "기획자": {
      "1학년": {
        subjects: [
          { name: "경영학원론", credits: 3, description: "경영학 기초 이론", importance: "high" },
          { name: "마케팅원론", credits: 3, description: "마케팅 기초 개념", importance: "high" },
          { name: "통계학개론", credits: 3, description: "기초 통계와 확률", importance: "medium" },
          { name: "컴퓨터활용", credits: 3, description: "오피스 프로그램 활용", importance: "medium" }
        ],
        certifications: [
          { name: "컴활 1급", organization: "대한상공회의소", difficulty: "easy", description: "컴퓨터활용능력 자격증" },
          { name: "ITQ 파워포인트", organization: "한국생산성본부", difficulty: "easy", description: "프레젠테이션 도구 활용" }
        ]
      },
      "2학년": {
        subjects: [
          { name: "소비자행동론", credits: 3, description: "고객 심리와 구매 패턴", importance: "high" },
          { name: "기획론", credits: 3, description: "전략기획과 실행방법", importance: "high" },
          { name: "데이터분석기초", credits: 3, description: "Excel, SPSS 활용", importance: "high" },
          { name: "프레젠테이션기법", credits: 3, description: "효과적인 발표 스킬", importance: "medium" }
        ],
        certifications: [
          { name: "사회조사분석사 2급", organization: "한국산업인력공단", difficulty: "medium", description: "시장조사와 데이터 분석" },
          { name: "Google Analytics 개인자격증", organization: "Google", difficulty: "medium", description: "웹 분석 기초" }
        ]
      },
      "3학년": {
        subjects: [
          { name: "디지털마케팅", credits: 3, description: "온라인 마케팅 전략", importance: "high" },
          { name: "프로젝트관리", credits: 3, description: "PMP 방법론과 도구", importance: "high" },
          { name: "빅데이터분석", credits: 3, description: "Python, R을 활용한 분석", importance: "high" },
          { name: "브랜드관리론", credits: 3, description: "브랜드 전략과 관리", importance: "medium" }
        ],
        certifications: [
          { name: "Google Ads 인증", organization: "Google", difficulty: "medium", description: "구글 광고 전문가" },
          { name: "PMP", organization: "PMI", difficulty: "hard", description: "프로젝트 관리 전문가" }
        ]
      },
      "4학년": {
        subjects: [
          { name: "비즈니스분석", credits: 3, description: "BA 방법론과 도구", importance: "high" },
          { name: "스타트업경영", credits: 3, description: "린 스타트업과 애자일", importance: "medium" },
          { name: "졸업프로젝트", credits: 6, description: "실제 기획 프로젝트", importance: "high" },
          { name: "글로벌마케팅", credits: 3, description: "국제 마케팅 전략", importance: "medium" }
        ],
        certifications: [
          { name: "CBAP", organization: "IIBA", difficulty: "hard", description: "비즈니스 분석 전문가" },
          { name: "Facebook Blueprint", organization: "Meta", difficulty: "medium", description: "페이스북 마케팅 전문가" }
        ]
      }
    }
  },
  "design": {
    "UI/UX 디자이너": {
      "1학년": {
        subjects: [
          { name: "디자인기초", credits: 3, description: "색채학과 조형 원리", importance: "high" },
          { name: "드로잉", credits: 3, description: "기초 스케치와 표현", importance: "medium" },
          { name: "컴퓨터그래픽스기초", credits: 3, description: "포토샵, 일러스트 기초", importance: "high" },
          { name: "타이포그래피", credits: 3, description: "글꼴과 레이아웃 디자인", importance: "high" }
        ],
        certifications: [
          { name: "GTQ 1급", organization: "한국생산성본부", difficulty: "easy", description: "그래픽 기술 자격증" },
          { name: "컬러리스트산업기사", organization: "한국산업인력공단", difficulty: "medium", description: "색채 전문가" }
        ]
      },
      "2학년": {
        subjects: [
          { name: "UI디자인", credits: 3, description: "사용자 인터페이스 설계", importance: "high" },
          { name: "웹디자인", credits: 3, description: "HTML, CSS 기초", importance: "high" },
          { name: "사용자경험설계", credits: 3, description: "UX 리서치와 프로토타이핑", importance: "high" },
          { name: "모바일디자인", credits: 3, description: "앱 인터페이스 디자인", importance: "high" }
        ],
        certifications: [
          { name: "웹디자인기능사", organization: "한국산업인력공단", difficulty: "medium", description: "웹 디자인 자격증" },
          { name: "Adobe Certified Expert", organization: "Adobe", difficulty: "medium", description: "어도비 전문가 인증" }
        ]
      },
      "3학년": {
        subjects: [
          { name: "인터랙션디자인", credits: 3, description: "동적 UI와 애니메이션", importance: "high" },
          { name: "디자인시스템", credits: 3, description: "일관된 디자인 가이드", importance: "high" },
          { name: "사용성테스트", credits: 3, description: "UX 평가와 개선", importance: "high" },
          { name: "프로토타이핑", credits: 3, description: "Figma, Sketch 활용", importance: "high" }
        ],
        certifications: [
          { name: "Google UX Design Certificate", organization: "Google", difficulty: "medium", description: "구글 UX 디자인 인증" },
          { name: "Nielsen Norman UX Certification", organization: "Nielsen Norman Group", difficulty: "hard", description: "UX 전문가 인증" }
        ]
      },
      "4학년": {
        subjects: [
          { name: "서비스디자인", credits: 3, description: "전체 서비스 경험 설계", importance: "high" },
          { name: "디자인전략", credits: 3, description: "비즈니스와 디자인 연결", importance: "medium" },
          { name: "졸업프로젝트", credits: 6, description: "포트폴리오 제작", importance: "high" },
          { name: "디자인트렌드분석", credits: 3, description: "최신 디자인 동향", importance: "medium" }
        ],
        certifications: [
          { name: "Human Factors International UX Certification", organization: "HFI", difficulty: "hard", description: "UX 전문가 고급 인증" },
          { name: "Certified Usability Analyst", organization: "Human Factors International", difficulty: "hard", description: "사용성 분석 전문가" }
        ]
      }
    }
  }
};
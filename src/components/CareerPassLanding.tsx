import { useState } from "react";
import img from "figma:asset/4d1244c8cd23f93c1a9d40fe9c4df8756afecddf.png";
import img1 from "figma:asset/ea411b67d9d8f4940503f315d1f62c9645638951.png";
import img2 from "figma:asset/e8ecf5fd235a44ec8892682cb666f9c6ef930952.png";
import imgJobInterview1 from "figma:asset/a760a2b4777fbcfa73298650beeea2b5f7b56133.png";
import imgDocuments1 from "figma:asset/0e09dacb4105c92c909cccbe5e62b5a7a22cbfbf.png";
import imgStudentCard1 from "figma:asset/11876833bc44e79bf713be48e147b2f818473679.png";
import img3 from "figma:asset/b75831d3b3e1189dc1796e5c79e974017e011974.png";
import logoImage from "figma:asset/7c5aa6dae84b9f121dc975eb56a63a422cedd564.png";

// [유지]: svgPaths 오류 회피
const svgPaths = {
    p32243b00: "M10 8h1155v390H10z", 
    p277ea880: "M0 0h1155v390H0z", 
};
// -----------------------------------------------------------------------------------

type PageType = 'main' | 'roadmap' | 'resume' | 'interview'; 

interface CareerPassLandingProps { 
  onPageChange: (page: PageType) => void;
  onLoginClick: () => void; 
} 

function Component5() { 
  return ( 
    <div className="absolute h-[473.5px] left-[142px] top-[241px] w-[1165px]" data-name="메인페이지 아이콘"> 
      <div className="absolute bottom-[-0.02%] left-0 right-[-1.29%] top-0"> 
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1180 474"> 
          <g id="메인페이지 아이콘"> 
            <g filter="url(#filter0_d_2003_106)" id="메인페이지 아이콘 보조"> 
              <path d={svgPaths.p32243b00} fill="var(--fill-0, #5672DB)" id="Polygon 1" /> 
              <rect fill="var(--fill-0, #505EBF)" height="390" id="Rectangle 2" rx="192" width="1155" x="10" y="8" /> 
            </g> 
            <path d={svgPaths.p277ea880} fill="var(--fill-0, #051243)" id="Polygon 1_2" /> 
            <rect fill="var(--fill-0, #051243)" height="390" id="Rectangle 2_2" rx="192" width="1155" /> 
          </g> 
          <defs> 
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="465.595" id="filter0_d_2003_106" width="1170" x="10" y="8"> 
              <feFlood floodOpacity="0" result="BackgroundImageFix" /> 
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" /> 
              <feOffset dx="10" dy="25" /> 
              <feGaussianBlur stdDeviation="2.5" /> 
              <feComposite in2="hardAlpha" operator="out" /> 
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" /> 
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2003_106" /> 
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2003_106" mode="normal" result="shape" /> 
            </filter> 
          </defs> 
        </svg> 
      </div> 
    </div> 
  );
} 

function Component4() { 
  return ( 
    <div className="absolute left-[127px] top-[2320px] w-[1122px]" data-name="합격자 후기4"> 
      <div className="bg-[#051243] h-[104px] rounded-[192px] w-full flex items-center justify-start px-8"> 
        <div className="flex-1 flex flex-col items-start text-left"> 
          <p className="font-['Noto_Sans_KR:Light',_sans-serif] font-light text-[18px] text-white mb-1 text-left">최*현 · LG유플러스 합격</p> 
          <p className="font-['Noto_Sans_KR:Light',_sans-serif] font-light text-[16px] text-white text-left">"합격자 후기를 보며 동기부여를 받고, 저도 CareerPass의 도움으로 원하는 회사에 입사할 수 있었습니다."</p> 
        </div> 
        <div className="bg-center bg-cover bg-no-repeat size-[70px] rounded-full ml-6" data-name="합격자 프로필(남)" style={{ backgroundImage: `url('${img}')` }} /> 
      </div> 
    </div> 
  );
} 

function Component3() { 
  return ( 
    <div className="absolute left-[127px] top-[2166px] w-[1122px]" data-name="합격자 후기3"> 
      <div className="bg-[#051243] h-[104px] rounded-[192px] w-full flex items-center px-8"> 
        <div className="bg-center bg-cover bg-no-repeat size-[70px] rounded-full mr-6" data-name="합격자 프로필(여)" style={{ backgroundImage: `url('${img1}')` }} /> 
        <div className="flex-1"> 
          <p className="font-['Noto_Sans_KR:Light',_sans-serif] font-light text-[18px] text-white mb-1">박*지 · 현대자동차 합격</p> 
          <p className="font-['Noto_Sans_KR:Light',_sans-serif] font-light text-[16px] text-white">"자격증 로드맵으로 준비 순서를 알 수 있었고, 불필요한 공부 시간을 줄일 수 있었습니다."</p> 
        </div> 
      </div> 
    </div> 
  );
} 

function Component2() { 
  return ( 
    <div className="absolute left-[127px] top-[2012px] w-[1122px]" data-name="합격자 후기2"> 
      <div className="bg-[#051243] h-[104px] rounded-[192px] w-full flex items-center justify-start px-8"> 
        <div className="flex-1 flex flex-col items-start text-left"> 
          <p className="font-['Noto_Sans_KR:Light',_sans-serif] font-light text-[18px] text-white mb-1 text-left">이*연 · 카카오 합격</p> 
          <p className="font-['Noto_Sans_KR:Light',_sans-serif] font-light text-[16px] text-white text-left">"AI 모의면접에서 받은 예상질문이 실제 면접에서 나와, 실전에서도 떨지 않고 대답할 수 있었습니다."</p> 
        </div> 
        <div className="bg-center bg-cover bg-no-repeat size-[70px] rounded-full ml-6" data-name="합격자 프로필(여)" style={{ backgroundImage: `url('${img1}')` }} /> 
      </div> 
    </div> 
  );
} 

function Component1() { 
  return ( 
    <div className="absolute left-[127px] top-[1858px] w-[1122px]" data-name="합격자 후기1"> 
      <div className="bg-[#051243] h-[104px] rounded-[192px] w-full flex items-center px-8"> 
        <div className="bg-center bg-cover bg-no-repeat size-[70px] rounded-full mr-6" data-name="합격자 프로필(남)" style={{ backgroundImage: `url('${img}')` }} /> 
        <div className="flex-1"> 
          <p className="font-['Noto_Sans_KR:Light',_sans-serif] font-light text-[18px] text-white mb-1">김*수 · 삼성전자 합격</p> 
          <p className="font-['Noto_Sans_KR:Light',_sans-serif] font-light text-[16px] text-white">"CareerPass 덕분에 자소서 피드백과 예상 질문 준비가 훨씬 수월했어요. 면접장에서 자신감이 생겼습니다."</p> 
        </div> 
      </div> 
    </div> 
  );
} 

function Component6() { 
  return ( 
    <div className="absolute contents left-[127px] top-[1737px]" data-name="합격자후기"> 
      <Component4 /> 
      <Component3 /> 
      <Component2 /> 
      <Component1 /> 
      <p className="absolute font-['Noto_Sans_KR:Medium',_sans-serif] font-medium leading-[normal] left-[623px] text-[40px] text-black text-nowrap top-[1737px] whitespace-pre">합격자 후기</p> 
    </div> 
  );
} 


function Component7({ onPageChange }: { onPageChange: (page: PageType) => void }) { 
  return ( 
    <div  
      // [수정]: 오른쪽 끝에서 250px 떨어진 곳에 배치하여 로그인 버튼 옆에 위치
      className="absolute top-[56px] right-[250px] flex space-x-10 z-20"  
      data-name="목록버튼" 
    > 
      <button  
        onClick={() => onPageChange('roadmap')} 
        className="text-[20px] font-['Noto_Sans_KR:Medium',_sans-serif] px-4 py-2 rounded-full text-black hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 cursor-pointer whitespace-nowrap" 
      > 
        취업 로드맵 
      </button> 
      <button  
        onClick={() => onPageChange('resume')} 
        className="text-[20px] font-['Noto_Sans_KR:Medium',_sans-serif] px-4 py-2 rounded-full text-black hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 cursor-pointer whitespace-nowrap" 
      > 
        자기소개서 AI 
      </button> 
      <button  
        onClick={() => onPageChange('interview')} 
        className="text-[20px] font-['Noto_Sans_KR:Medium',_sans-serif] px-4 py-2 rounded-full text-black hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 cursor-pointer whitespace-nowrap" 
      > 
        AI 모의면접 
      </button> 
    </div> 
  );
}

// src/components/CareerPassLanding.tsx 파일 내 Component8 함수

function Component8({ onLoginClick }: { onLoginClick: () => void }) { 
  return ( 
    <div  
      onClick={onLoginClick} 
      // [수정]: 원래의 'absolute' 위치 지정으로 복구합니다.
      className="absolute left-[1331px] size-[62px] top-[46px] hover:scale-105 transition-transform cursor-pointer z-20"  
      data-name="프로필" 
    > 
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 62 62"> 
        <circle cx="31" cy="31" id="Ellipse 2" r="30.5" stroke="var(--stroke-0, black)" /> 
      </svg> 
      <div className="absolute aspect-[512/512] bg-center bg-cover bg-no-repeat left-[12.9%] right-[12.02%] top-[8px] pointer-events-none" data-name="프로필" style={{ backgroundImage: 
`url('${img2}')` }} /> 
    </div> 
  );
}

function Component9({ onPageChange }: { onPageChange: (page: PageType) => void }) { 
  return ( 
    <div className="absolute contents left-[917px] top-[1062px]" data-name="모의면접 소개글"> 
      <button  
        onClick={() => onPageChange('interview')} 
        className="absolute bg-white h-[422.921px] left-[917px] rounded-[90px] top-[1126.08px] w-[380px] hover:shadow-lg transition-shadow cursor-pointer group" 
      > 
        <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[90px] shadow-[0px_8px_1px_0px_rgba(0,0,0,0.25)] group-hover:border-blue-400" /> 
      </button> 
      <p className="absolute font-['Noto_Sans_KR:Light',_sans-serif] font-light leading-[normal] left-[1017px] text-[28px] text-black text-center top-[1080px] w-[180px] pointer-events-none">AI 모의면접</p> 
      <p className="absolute font-['Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[normal] left-[944px] text-[#505ebf] text-[18px] text-center top-[1160px] w-[326px] pointer-events-none">"실전 같은 모의면접, AI가 함께합니다"</p> 
      <div className="absolute bg-center bg-cover bg-no-repeat left-[1041px] size-[131px] top-[1210px] pointer-events-none" data-name="job-interview 1" style={{ backgroundImage: `url('${imgJobInterview1}')` }} /> 
      <div className="absolute font-['Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[0] left-[954px] text-[0px] text-black top-[1380px] w-[305px] pointer-events-none"> 
        <p className="leading-[24px] mb-[8px] text-[16px]"> 
          <span>{`📍 `}</span> 
          <span className="font-['Noto_Sans_KR:Medium',_sans-serif] font-medium">음성인식</span> 
          <span className="font-['Noto_Sans_KR:Light',_sans-serif] font-light">{` 기반 실시간 답변 분석`}</span> 
        </p> 
        <p className="leading-[24px] mb-[8px] text-[16px]"> 
          📍<span className="font-['Noto_Sans_KR:Light',_sans-serif] font-light">{` 발음·속도·어투까지 피드백 제공`}</span> 
        </p> 
        <p className="leading-[24px] text-[16px]"> 
          <span className="font-['Noto_Sans_KR:Light',_sans-serif] font-light">📍 언제 어디서</span> 
          <span className="font-['Noto_Sans_KR:Medium',_sans-serif] font-medium">{`든 실전 같`}</span> 
          <span className="font-['Noto_Sans_KR:Light',_sans-serif] font-light">{`은 면접 경험`}</span> 
        </p> 
      </div> 
    </div> 
  );
} 

function Component10({ onPageChange }: { onPageChange: (page: PageType) => void }) { 
  return ( 
    <div className="absolute contents left-[529.5px] top-[1062px]" data-name="자소서피드백 소개글"> 
      <button  
        onClick={() => onPageChange('resume')} 
        className="absolute bg-white h-[422.921px] left-[529.5px] rounded-[90px] top-[1126.08px] w-[380px] hover:shadow-lg transition-shadow cursor-pointer group" 
      > 
        <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[90px] shadow-[0px_8px_1px_0px_rgba(0,0,0,0.25)] group-hover:border-blue-400" /> 
      </button> 
      <p className="absolute font-['Noto_Sans_KR:Light',_sans-serif] font-light leading-[normal] left-[619.5px] text-[28px] text-black text-center top-[1080px] w-[180px] pointer-events-none">자기소개서 AI</p> 
      <p className="absolute font-['Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[normal] left-[549.5px] text-[#505ebf] text-[18px] text-center top-[1160px] w-[330px] pointer-events-none">"AI와 함께하는 똑똑한 자소서 작성"</p> 
      <div className="absolute bg-center bg-cover bg-no-repeat left-[646px] size-[147px] top-[1210px] pointer-events-none" data-name="documents 1" style={{ backgroundImage: `url('${imgDocuments1}')` }} /> 
      <div className="absolute font-['Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[0] left-[557px] text-[0px] text-black top-[1380px] w-[325px] pointer-events-none"> 
        <p className="leading-[24px] mb-[8px] text-[16px]"> 
          <span className="font-['Noto_Sans_KR:Light',_sans-serif] font-light">{`📍 자소서 업로드 → 맞춤형 `}</span> 
          <span className="font-['Noto_Sans_KR:Medium',_sans-serif] font-medium">피드백</span> 
          <span className="font-['Noto_Sans_KR:Light',_sans-serif] font-light">{` 제공`}</span> 
        </p> 
        <p className="leading-[24px] mb-[8px] text-[16px]"> 
          <span className="font-['Noto_Sans_KR:Light',_sans-serif] font-light">📍 예상</span> 
          <span className="font-['Noto_Sans_KR:Medium',_sans-serif] font-medium">{` 면접 질`}</span> 
          <span className="font-['Noto_Sans_KR:Light',_sans-serif] font-light">문 자동 생성</span> 
        </p> 
        <p className="leading-[24px] text-[16px]"> 
          <span className="font-['Noto_Sans_KR:Light',_sans-serif] font-light">📍 강점이 돋보이도록 글 다듬기 가이드</span> 
        </p> 
      </div> 
    </div> 
  );
} 

function Component11({ onPageChange }: { onPageChange: (page: PageType) => void }) { 
  return ( 
    <div className="absolute contents left-[142px] top-[1062px]" data-name="자격증 소개글"> 
      <button  
        onClick={() => onPageChange('roadmap')} 
        className="absolute bg-white h-[422.921px] left-[142px] rounded-[90px] top-[1126.08px] w-[380px] hover:shadow-lg transition-shadow cursor-pointer group" 
      > 
        <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[90px] shadow-[0px_8px_1px_0px_rgba(0,0,0,0.25)] group-hover:border-blue-400" /> 
      </button> 
      <p className="absolute font-['Noto_Sans_KR:Light',_sans-serif] font-light leading-[normal] left-[232px] text-[28px] text-black text-center top-[1080px] w-[180px] pointer-events-none">자격증 로드맵</p> 
      <p className="absolute font-['Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[normal] left-[162px] text-[#505ebf] text-[18px] text-center top-[1160px] w-[340px] pointer-events-none">"커리어 여정의 첫걸음, 자격증 준비부터"</p> 
      <div className="absolute bg-left bg-no-repeat bg-size-[100%_132.06%] h-[131px] left-[240px] top-[1210px] w-[173px] pointer-events-none" data-name="student-card 1" style={{ backgroundImage: `url('${imgStudentCard1}')` }} /> 
      <div className="absolute font-['Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[0] left-[179px] text-[0px] text-black top-[1380px] w-[305px] pointer-events-none"> 
        <p className="leading-[24px] mb-[8px] text-[16px]"> 
          <span>{`📍 `}</span> 
          <span className="font-['Noto_Sans_KR:Light',_sans-serif] font-light">{`목표 직무에 맞는 필수 `}</span> 
          <span className="font-['Noto_Sans_KR:Medium',_sans-serif] font-medium">자격증 추천</span> 
        </p> 
        <p className="leading-[24px] mb-[8px] text-[16px]"> 
          📍<span className="font-['Noto_Sans_KR:Light',_sans-serif] font-light">{` 단계별`}</span> 
          <span className="font-['Noto_Sans_KR:Medium',_sans-serif] font-medium">{` 로드맵`}</span> 
          <span className="font-['Noto_Sans_KR:Light',_sans-serif] font-light">과 학습 계획 제공</span> 
        </p> 
        <p className="leading-[24px] text-[16px]"> 
          <span className="font-['Noto_Sans_KR:Light',_sans-serif] font-light">{`📍 누구나 무료 확인 가능`}</span> 
          <span className="font-['Noto_Sans_KR:Light',_sans-serif] font-light">{` → 커리어 방향 설정에 도움`}</span> 
        </p> 
      </div> 
    </div> 
  );
} 

function Component12({ onPageChange }: { onPageChange: (page: PageType) => void }) { 
  return ( 
    <div className="absolute contents left-[142px] top-[1062px]" data-name="소개글"> 
      <Component9 onPageChange={onPageChange} /> 
      <Component10 onPageChange={onPageChange} /> 
      <Component11 onPageChange={onPageChange} /> 
    </div> 
  );
} 

export function CareerPassLanding({ onPageChange, onLoginClick }: CareerPassLandingProps) { 
  return ( 
    <div className="bg-[#F6F8FB] relative size-full overflow-x-hidden" data-name="main page - 로그인 전" style={{ height: '2600px' }}> 
      
      {/* 🌟 [수정된 부분]: 통합된 네비게이션 바 (Flexbox 사용) 🌟 */}
      <div 
        className="absolute top-0 left-0 w-full h-[120px] bg-gradient-to-b from-white to-transparent z-10" 
        data-name="네비게이션 배경 및 그라데이션" 
      /> 
      
      {/* 로고, 메뉴, 로그인 버튼을 모두 포함하는 최상위 Flex 컨테이너 */}
      <div className="absolute top-0 left-0 w-full h-[120px] flex items-center justify-between px-16 z-20">
          
          {/* 1. 로고 (왼쪽 끝) */}
          <div className="flex-shrink-0 pt-6 pl-6"> 
              <img src={logoImage} alt="CareerPass Logo" className="w-40 h-28 object-contain" /> 
          </div> 
          
          {/* 2. 메뉴와 로그인 버튼 (오른쪽 끝) */}
          <div className="flex items-center space-x-10 pr-6">
              <Component7 onPageChange={onPageChange} /> {/* 메뉴 버튼들 */}
              <Component8 onLoginClick={onLoginClick} /> {/* 로그인 버튼 */}
          </div>
          
      </div>
      {/* 🌟 [수정된 부분] 끝 🌟 */}
      
      <div style={{ transform: 'translateY(-40px)' }}> 
        <Component5 /> 
      </div> 
      <Component6 /> 
      <div className="absolute bg-center bg-cover bg-no-repeat bg-[#f8f9fa] border-4 border-[#f1f3f4] h-[350px] left-[232px] rounded-[141px] top-[260px] w-[430px]" data-name="메인페이지 사진" style={{ backgroundImage: 
`url('${img3}')` }} /> 
      <div className="absolute h-0 left-[127px] top-[1000px] w-[1185px]" data-name="구분선1"> 
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]"> 
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1185 1"> 
            <line id="구분선 1" stroke="var(--stroke-0, #D2D2D2)" x2="1185" y1="0.5" y2="0.5" /> 
          </svg> 
        </div> 
      </div> 
      <div className="absolute h-0 left-[127px] top-[1665.24px] w-[1185px]" data-name="구분선2"> 
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]"> 
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1185 1"> 
            <line id="구분선 1" stroke="var(--stroke-0, #D2D2D2)" x2="1185" y1="0.5" y2="0.5" /> 
          </svg> 
        </div> 
      </div> 
      <div className="absolute h-0 left-[127px] top-[2541px] w-[1185px]" data-name="구분선3"> 
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]"> 
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1185 1"> 
            <line id="구분선 1" stroke="var(--stroke-0, #D2D2D2)" x2="1185" y1="0.5" y2="0.5" /> 
          </svg> 
        </div> 
      </div> 
      <p className="absolute font-['Noto_Sans_KR:Light',_sans-serif] font-light leading-[normal] left-[719px] text-[#727272] text-[15px] text-center text-nowrap top-[2564px] translate-x-[-50%] whitespace-pre">{`회사소개                    |              이용약관             |           개인정보처리방침         |                고객센터              @careerpass`}</p> 
      
      {/* 원본 Component7, Component8 호출 삭제됨 */}
      
      <div className="absolute font-['Source_Serif_Pro:Regular',_'Noto_Sans_KR:Regular',_sans-serif] leading-[normal] left-[980px] text-[0px] text-center text-nowrap text-white top-[330px] translate-x-[-50%] whitespace-pre flex flex-col items-center justify-center" style={{ fontVariationSettings: "'wght' 400" }}> 
        <p className="mb-2"> 
          <span className="text-[70px]">CareerPass</span> 
        </p> 
        <p className="text-[20px]">취업 성공으로 향하는 가장 확실한 패스</p> 
      </div> 
      
      {/* 원본 Component8 호출 삭제됨 */}
      
      <div className="absolute contents left-[142px] top-[1062px]" data-name="소개글"> 
        <Component9 onPageChange={onPageChange} /> 
        <Component10 onPageChange={onPageChange} /> 
        <Component11 onPageChange={onPageChange} /> 
      </div> 
    </div> 
  ); 
}



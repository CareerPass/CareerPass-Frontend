# 면접 답변 내용이 표시되지 않는 문제 진단 및 해결 방안

## 🔍 현재 문제 상황

1. **`uploadInterviewAudio` API 응답**: 
   - 현재 반환 필드: `id`, `fileUrl`, `status`, `jobApplied`, `userId` 등
   - **`transcript` 필드가 없음** ❌

2. **`getFeedbackByInterviewId` API 응답**:
   - 빈 배열 `[]` 반환 ❌
   - 질문별 답변 텍스트가 없음

3. **결과**: 
   - 프론트엔드의 `answers` 배열이 비어있음
   - 결과 화면에 "답변 내용이 없습니다" 표시

## 🎯 해결 방안

### 백엔드에서 필요한 작업

#### 1. `POST /api/interview/audio` 응답에 `transcript` 필드 추가

**현재 응답 구조:**
```json
{
  "id": 90,
  "fileUrl": "audio/xxx.webm",
  "status": "BEFANALYSE",
  "jobApplied": "시스템소프트웨어 개발자",
  "userId": 1
}
```

**필요한 응답 구조:**
```json
{
  "id": 90,
  "fileUrl": "audio/xxx.webm",
  "status": "BEFANALYSE",
  "jobApplied": "시스템소프트웨어 개발자",
  "userId": 1,
  "transcript": "사용자가 말한 답변 내용이 STT로 변환된 텍스트"  // ✅ 추가 필요
}
```

**백엔드 구현 방법:**
- 음성 파일 업로드 후 즉시 STT 변환 수행
- STT 변환이 완료되면 `transcript` 필드에 결과 포함
- STT 변환이 비동기로 처리되는 경우, `status`를 `"STT_PROCESSING"`으로 설정하고 나중에 조회 가능하도록

#### 2. `GET /api/feedback/interview/{interviewId}` 응답 수정

**현재 문제:**
- 빈 배열 `[]` 반환
- 질문별 답변 텍스트가 없음

**필요한 응답 구조:**
```json
[
  {
    "questionId": 1,
    "question": "질문 내용",
    "transcript": "해당 질문에 대한 답변 STT 텍스트",  // ✅ 추가 필요
    "answerText": "답변 텍스트",  // 또는 transcript와 동일
    "score": 85,
    "feedback": "피드백 내용"
  },
  {
    "questionId": 2,
    "question": "질문 내용",
    "transcript": "답변 STT 텍스트",
    "answerText": "답변 텍스트",
    "score": 90,
    "feedback": "피드백 내용"
  }
]
```

**백엔드 구현 방법:**
- 각 질문별로 업로드된 음성 파일의 STT 결과를 조회
- `transcript` 또는 `answerText` 필드에 STT 변환된 텍스트 포함
- STT가 아직 완료되지 않은 경우, 빈 문자열이나 null 반환

#### 3. STT 변환 처리 방식

**옵션 A: 동기 처리 (즉시 반환)**
- 음성 파일 업로드 → STT 변환 → 응답에 `transcript` 포함
- 장점: 프론트엔드에서 즉시 답변 텍스트 사용 가능
- 단점: 응답 시간이 길어질 수 있음

**옵션 B: 비동기 처리 (별도 조회)**
- 음성 파일 업로드 → 즉시 응답 (status: "STT_PROCESSING")
- STT 변환 완료 후 별도 API로 조회
- 장점: 빠른 응답 시간
- 단점: 프론트엔드에서 폴링 또는 웹소켓 필요

**권장: 옵션 A (동기 처리)**
- 면접 특성상 답변 시간이 충분하므로 STT 변환 시간을 기다릴 수 있음
- 구현이 간단하고 프론트엔드 로직이 단순해짐

### 프론트엔드에서 할 수 있는 개선

1. **더 자세한 디버깅 로그 추가** ✅ (이미 완료)
2. **응답 구조 확인 및 처리 로직 강화** ✅ (이미 완료)
3. **폴링 메커니즘 추가** (STT가 비동기로 처리되는 경우)

## 📋 체크리스트

### 백엔드 작업
- [ ] `POST /api/interview/audio` 응답에 `transcript` 필드 추가
- [ ] STT 변환 로직 구현 (동기 또는 비동기)
- [ ] `GET /api/feedback/interview/{interviewId}` 응답에 질문별 `transcript` 필드 추가
- [ ] STT 변환 실패 시 에러 처리

### 프론트엔드 작업
- [x] `transcript` 필드 추출 로직 추가
- [x] 디버깅 로그 강화
- [ ] STT 변환 대기 로직 (비동기 처리인 경우)
- [ ] 에러 처리 및 사용자 안내 메시지

## 🧪 테스트 방법

1. 면접 시작 → 질문에 답변
2. 콘솔에서 다음 로그 확인:
   - `"음성 업로드 성공 - 전체 응답:"` - `transcript` 필드 확인
   - `"transcript 필드 확인:"` - 값이 있는지 확인
   - `"추출된 답변 텍스트:"` - 텍스트가 추출되었는지 확인
   - `"업데이트된 answers 배열:"` - 배열에 값이 저장되었는지 확인
3. 결과 화면에서 답변 내용이 표시되는지 확인

## 💡 권장 사항

**가장 빠른 해결 방법:**
1. 백엔드에서 `POST /api/interview/audio` 응답에 `transcript` 필드를 추가
2. 음성 파일 업로드 후 즉시 STT 변환 수행
3. STT 변환 결과를 응답에 포함

이렇게 하면 프론트엔드 코드 수정 없이도 답변 내용이 표시됩니다.



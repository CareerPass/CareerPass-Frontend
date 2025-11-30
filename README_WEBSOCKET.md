# WebSocket 환경 변수 설정 가이드

## 환경 변수 설정

`.env.local` 파일에 다음을 추가하세요:

```
VITE_WS_URL=ws://192.168.0.13:3000
```

또는

```
VITE_WS_URL=ws://내 백엔드 서버 주소:포트
```

## 사용 방법

### 1. 기본 사용법

```typescript
import { createWebSocketConnection, getWebSocketUrl } from '../utils/websocket';

// 환경 변수에서 URL 가져오기
const wsUrl = getWebSocketUrl();

// WebSocket 연결 생성
const ws = createWebSocketConnection();

// 이벤트 리스너 설정
ws.onopen = () => {
  console.log('WebSocket 연결 성공');
};

ws.onmessage = (event) => {
  console.log('메시지 수신:', event.data);
};

ws.onerror = (error) => {
  console.error('WebSocket 오류:', error);
};

ws.onclose = () => {
  console.log('WebSocket 연결 종료');
};
```

### 2. 직접 URL 지정

```typescript
import { createWebSocketConnection } from '../utils/websocket';

// 특정 URL로 연결
const ws = createWebSocketConnection('ws://192.168.0.13:3000');
```

## 주의사항

- Vite 프로젝트이므로 환경 변수는 `VITE_` 접두사가 필요합니다
- 환경 변수가 설정되지 않으면 기본값 `ws://localhost:3000`을 사용합니다
- 개발 서버를 재시작해야 환경 변수 변경사항이 적용됩니다


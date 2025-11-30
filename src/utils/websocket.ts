// WebSocket 연결 유틸리티
// 환경 변수에서 WebSocket URL을 가져옵니다

export function getWebSocketUrl(): string {
  // Vite 환경 변수는 VITE_ 접두사가 필요합니다
  const wsUrl = import.meta.env.VITE_WS_URL || import.meta.env.REACT_APP_WS_URL;
  
  if (!wsUrl) {
    console.warn('WebSocket URL이 환경 변수에 설정되지 않았습니다. 기본값 ws://localhost:3000을 사용합니다.');
    return 'ws://localhost:3000';
  }
  
  return wsUrl;
}

export function createWebSocketConnection(url?: string): WebSocket {
  const wsUrl = url || getWebSocketUrl();
  
  try {
    const ws = new WebSocket(wsUrl);
    return ws;
  } catch (error) {
    console.error('WebSocket 연결 생성 실패:', error);
    throw error;
  }
}


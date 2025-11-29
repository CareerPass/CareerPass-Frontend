// fetch는 기본 브라우저 API이므로 별도의 import가 필요 없습니다.
// Vite 환경에서는 import.meta.env를 사용하지만, 호환성을 위해 둘 다 지원
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 기본 fetch 래퍼 함수
const fetchApi = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        // 4xx, 5xx 에러 처리
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            // 사용자 정의 에러 객체를 throw
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        // 응답 본문이 없을 경우 처리 (e.g. 204 No Content)
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json();
        }
        return response.text();
    } catch (error) {
        // 네트워크 오류나 기타 오류 발생 시 에러를 다시 throw
        console.error('API 호출 실패:', error);
        throw error;
    }
};

// 로드맵 API
// GET: http://13.125.192.47:8090/api/roadmap/major - 학과 로드맵 조회
// 요청 파라미터: major (query, string)
// 요청 바디: 없음
// 응답: 로드맵 배열 (id, roadmapType, major, job, majorName, certName, grade)
export const getRoadmapMajor = async (major) => {
    try {
        // querystring 자동으로 구성 (URLSearchParams 사용)
        const params = new URLSearchParams();
        if (major !== undefined && major !== null && major !== '') {
            params.append('major', major.toString());
        }
        const queryString = params.toString();
        const url = queryString 
            ? `http://13.125.192.47:8090/api/roadmap/major?${queryString}`
            : 'http://13.125.192.47:8090/api/roadmap/major';

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // response.ok가 아닐 경우 콘솔에 status와 message 출력
            const errorText = await response.text().catch(() => '');
            const errorJson = await response.json().catch(() => ({}));
            console.error('API 오류:', {
                status: response.status,
                statusText: response.statusText,
                message: errorJson.message || errorJson.error || errorText || '알 수 없는 오류',
                errorData: errorJson
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorJson.message || errorJson.error || errorText}`);
        }

        // 정상인 경우 JSON 데이터 console.log
        const data = await response.json();
        console.log('GET /api/roadmap/major 응답:', data);
        return data;
    } catch (error) {
        // 오류 발생 시 상세 오류를 알 수 있도록 출력
        console.error('getRoadmapMajor 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error,
            major: major
        });
        throw error;
    }
};

// GET: http://13.125.192.47:8090/api/roadmap/cert - 자격증 로드맵 조회
// 요청 파라미터: major (query, string), job (query, string)
// 요청 바디: 없음
// 응답: 로드맵 배열 (id, roadmapType, major, job, majorName, certName, grade)
export const getRoadmapCert = async (major, job) => {
    try {
        // querystring 자동으로 구성 (URLSearchParams 사용)
        const params = new URLSearchParams();
        if (major !== undefined && major !== null && major !== '') {
            params.append('major', major.toString());
        }
        if (job !== undefined && job !== null && job !== '') {
            params.append('job', job.toString());
        }
        const queryString = params.toString();
        const url = queryString 
            ? `http://13.125.192.47:8090/api/roadmap/cert?${queryString}`
            : 'http://13.125.192.47:8090/api/roadmap/cert';

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // response.ok가 아닐 경우 콘솔에 status와 message 출력
            const errorText = await response.text().catch(() => '');
            const errorJson = await response.json().catch(() => ({}));
            console.error('API 오류:', {
                status: response.status,
                statusText: response.statusText,
                message: errorJson.message || errorJson.error || errorText || '알 수 없는 오류',
                errorData: errorJson
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorJson.message || errorJson.error || errorText}`);
        }

        // 정상인 경우 JSON 데이터 console.log
        const data = await response.json();
        console.log('GET /api/roadmap/cert 응답:', data);
        return data;
    } catch (error) {
        // 오류 발생 시 상세 오류를 알 수 있도록 출력
        console.error('getRoadmapCert 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error,
            major: major,
            job: job
        });
        throw error;
    }
};


// 자기소개서 API
// GET: http://13.125.192.47:8090/api/introductions - 자기소개서 목록 조회
// 요청 파라미터: userId (query, integer)
// 요청 바디: 없음
// 응답: 자기소개서 배열 (id, userId, jobApplied, introText, submissionTime)
export const getIntroductions = async (userId) => {
    try {
        // querystring 자동으로 구성 (URLSearchParams 사용)
        const params = new URLSearchParams();
        if (userId !== undefined && userId !== null) {
            params.append('userId', userId.toString());
        }
        const queryString = params.toString();
        const url = queryString 
            ? `http://13.125.192.47:8090/api/introductions?${queryString}`
            : 'http://13.125.192.47:8090/api/introductions';

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // response.ok가 아닐 경우 콘솔에 status와 message 출력
            const errorText = await response.text().catch(() => '');
            const errorJson = await response.json().catch(() => ({}));
            console.error('API 오류:', {
                status: response.status,
                statusText: response.statusText,
                message: errorJson.message || errorJson.error || errorText || '알 수 없는 오류',
                errorData: errorJson
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorJson.message || errorJson.error || errorText}`);
        }

        // 정상인 경우 JSON 데이터 console.log
        const data = await response.json();
        console.log('GET /api/introductions 응답:', data);
        return data;
    } catch (error) {
        // 오류 발생 시 상세 오류를 알 수 있도록 출력
        console.error('getIntroductions 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error,
            userId: userId
        });
        throw error;
    }
};

// POST: http://13.125.192.47:8090/api/introductions - 자기소개서 생성
// 요청 파라미터: 없음
// 요청 바디(JSON): { userId: 0, jobApplied: "string", introText: "string", submissionTime: "string" }
// 응답: 자기소개서 객체 (id, userId, jobApplied, introText, submissionTime)
export const createIntroduction = async (requestBody) => {
    try {
        const response = await fetch('http://13.125.192.47:8090/api/introductions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            // response.ok가 아닐 경우 콘솔에 status와 message 출력
            const errorText = await response.text().catch(() => '');
            const errorJson = await response.json().catch(() => ({}));
            console.error('API 오류:', {
                status: response.status,
                statusText: response.statusText,
                message: errorJson.message || errorJson.error || errorText || '알 수 없는 오류',
                errorData: errorJson
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorJson.message || errorJson.error || errorText}`);
        }

        // 정상인 경우 JSON 데이터 console.log
        const data = await response.json();
        console.log('POST /api/introductions 응답:', data);
        return data;
    } catch (error) {
        // 오류 발생 시 상세 오류를 알 수 있도록 출력
        console.error('createIntroduction 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error,
            requestBody: requestBody
        });
        throw error;
    }
};

// GET: http://13.125.192.47:8090/api/introductions/{id} - 특정 자기소개서 조회
// 요청 파라미터: id (path variable, integer)
// 요청 바디: 없음
// 응답: 자기소개서 객체 (id, userId, jobApplied, introText, submissionTime)
export const getIntroductionById = async (id) => {
    try {
        const response = await fetch(`http://13.125.192.47:8090/api/introductions/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // response.ok가 아닐 경우 콘솔에 status와 message 출력
            const errorText = await response.text().catch(() => '');
            const errorJson = await response.json().catch(() => ({}));
            console.error('API 오류:', {
                status: response.status,
                statusText: response.statusText,
                message: errorJson.message || errorJson.error || errorText || '알 수 없는 오류',
                errorData: errorJson
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorJson.message || errorJson.error || errorText}`);
        }

        // 정상인 경우 JSON 데이터 console.log
        const data = await response.json();
        console.log(`GET /api/introductions/${id} 응답:`, data);
        return data;
    } catch (error) {
        // 오류 발생 시 상세 오류를 알 수 있도록 출력
        console.error('getIntroductionById 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error,
            introductionId: id
        });
        throw error;
    }
};

// 자기소개서 학습 기록 API
// POST: http://13.125.192.47:8090/api/introduction-learning - 자기소개서 학습 기록 생성
// 요청 파라미터: 없음
// 요청 바디(JSON): { userId: 0, introductionId: 0, questionCount: 0 }
// 응답: 학습 기록 객체 (id, userId, introduction, questionCount, learnedAt)
export const createIntroductionLearning = async (requestBody) => {
    try {
        const response = await fetch('http://13.125.192.47:8090/api/introduction-learning', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            // response.ok가 아닐 경우 콘솔에 status와 message 출력
            const errorText = await response.text().catch(() => '');
            const errorJson = await response.json().catch(() => ({}));
            console.error('API 오류:', {
                status: response.status,
                statusText: response.statusText,
                message: errorJson.message || errorJson.error || errorText || '알 수 없는 오류',
                errorData: errorJson
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorJson.message || errorJson.error || errorText}`);
        }

        // 정상인 경우 JSON 데이터 console.log
        const data = await response.json();
        console.log('POST /api/introduction-learning 응답:', data);
        return data;
    } catch (error) {
        // 오류 발생 시 상세 오류를 알 수 있도록 출력
        console.error('createIntroductionLearning 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error,
            requestBody: requestBody
        });
        throw error;
    }
};

// 로그인 또는 자동가입 API
// POST: http://13.125.192.47:8090/api/users/login - 이메일로 로그인 또는 자동가입
// 요청 바디(JSON): { email: string }
// 응답: 사용자 프로필 객체
export const loginOrCreateUser = async (email) => {
    try {
        const response = await fetch('http://13.125.192.47:8090/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email
            }),
        });

        if (!response.ok) {
            const msg = await response.text().catch(() => '');
            throw new Error(`login failed: ${msg}`);
        }

        const profile = await response.json();
        console.log('POST /api/users/login 응답:', profile);
        return profile;
    } catch (error) {
        console.error('loginOrCreateUser 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error,
            email: email
        });
        throw error;
    }
};

// 이메일만으로 사용자 생성 API
// POST: http://13.125.192.47:8090/api/users - 이메일만으로 사용자 생성
// 요청 바디(JSON): { email: string, nickname: null, major: null, targetJob: null }
// 응답: 사용자 객체
export const createUserWithEmail = async (email) => {
    try {
        const response = await fetch('http://13.125.192.47:8090/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,          // ✅ 이메일만 사용
                nickname: null,         // 백엔드에서 무시하거나 기본값 처리
                major: null,
                targetJob: null,
            }),
        });

        // 이미 가입한 유저면 409 가능
        if (!response.ok) {
            throw new Error(`HTTP_${response.status}`);
        }

        const data = await response.json();
        console.log('POST /api/users (email only) 응답:', data);
        return data;
    } catch (error) {
        console.error('createUserWithEmail 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error,
            email: email
        });
        throw error;
    }
};

// 사용자 인증 API
// GET: {API_BASE_URL}/me - 현재 사용자 정보 조회 (Swagger 기준)
// 요청 파라미터: 없음
// 요청 바디: 없음
// 응답: 사용자 정보 객체
export const getMe = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP_${response.status}`);
        }

        const data = await response.json();
        console.log('GET /api/me 응답:', data);
        return data;
    } catch (error) {
        console.error('getMe 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error
        });
        throw error;
    }
};

// 사용자 프로필 업데이트 API
// PATCH: http://13.125.192.47:8090/api/users/{id}/profile - 사용자 프로필 수정
// 요청 파라미터: id (path, integer)
// 요청 바디(JSON): { nickname: string, major: string, targetJob: string }
// 응답: 업데이트된 사용자 정보 객체
export const updateUserProfile = async (id, { nickname, major, targetJob }) => {
    try {
        if (!id) {
            throw new Error('id는 필수입니다.');
        }

        const response = await fetch(`http://13.125.192.47:8090/api/users/${id}/profile`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nickname: nickname,
                major: major,
                targetJob: targetJob
            }),
        });

        if (!response.ok) {
            // response.ok가 아닐 경우 콘솔에 status와 message 출력
            const errorText = await response.text().catch(() => '');
            const errorJson = await response.json().catch(() => ({}));
            console.error('API 오류:', {
                status: response.status,
                statusText: response.statusText,
                message: errorJson.message || errorJson.error || errorText || '알 수 없는 오류',
                errorData: errorJson
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorJson.message || errorJson.error || errorText}`);
        }

        // 정상인 경우 JSON 데이터 console.log
        const data = await response.json();
        console.log('PATCH /api/users/{id}/profile 응답:', data);
        return data;
    } catch (error) {
        // 오류 발생 시 상세 오류를 알 수 있도록 출력
        console.error('updateUserProfile 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error,
            id: id,
            profileData: { nickname, major, targetJob }
        });
        throw error;
    }
};

// 사용자 ID로 조회 API
// GET: http://13.125.192.47:8090/api/users/{id} - 사용자 ID로 조회
// 요청 파라미터: id (path, integer)
// 요청 바디: 없음
// 응답: 사용자 객체 (nickname, email, major, targetJob, profileCompleted, recentInterviews, recentIntroductions)
export const getUserById = async (id) => {
    try {
        if (!id) {
            throw new Error('id는 필수입니다.');
        }

        const response = await fetch(`http://13.125.192.47:8090/api/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // response.ok가 아닐 경우 콘솔에 status와 message 출력
            const errorText = await response.text().catch(() => '');
            const errorJson = await response.json().catch(() => ({}));
            console.error('API 오류:', {
                status: response.status,
                statusText: response.statusText,
                message: errorJson.message || errorJson.error || errorText || '알 수 없는 오류',
                errorData: errorJson
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorJson.message || errorJson.error || errorText}`);
        }

        // 정상인 경우 JSON 데이터 console.log
        const data = await response.json();
        console.log('GET /api/users/{id} 응답:', data);
        return data;
    } catch (error) {
        // 오류 발생 시 상세 오류를 알 수 있도록 출력
        console.error('getUserById 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error,
            id: id
        });
        throw error;
    }
};

// 사용자 목록 조회 API
// GET: http://13.125.192.47:8090/api/users - 사용자 목록 조회
// 요청 파라미터: 없음
// 요청 바디: 없음
// 응답: 사용자 배열 (nickname, email, major, targetJob, profileCompleted, recentInterviews, recentIntroductions)
export const getUsers = async () => {
    try {
        const response = await fetch('http://13.125.192.47:8090/api/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // response.ok가 아닐 경우 콘솔에 status와 message 출력
            const errorText = await response.text().catch(() => '');
            const errorJson = await response.json().catch(() => ({}));
            console.error('API 오류:', {
                status: response.status,
                statusText: response.statusText,
                message: errorJson.message || errorJson.error || errorText || '알 수 없는 오류',
                errorData: errorJson
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorJson.message || errorJson.error || errorText}`);
        }

        // 정상인 경우 JSON 데이터 console.log
        const data = await response.json();
        console.log('GET /api/users 응답:', data);
        return data;
    } catch (error) {
        // 오류 발생 시 상세 오류를 알 수 있도록 출력
        console.error('getUsers 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error
        });
        throw error;
    }
};

// 사용자 생성 API
// POST: http://13.125.192.47:8090/api/users - 사용자 생성
// 요청 파라미터: 없음
// 요청 바디(JSON): { nickname: string, major: string, targetJob: string }
// 응답: 사용자 객체 (nickname, email, major, targetJob, profileCompleted, recentInterviews, recentIntroductions)
export const createUser = async ({ nickname, major, targetJob }) => {
    try {
        const response = await fetch('http://13.125.192.47:8090/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nickname: nickname,
                major: major,
                targetJob: targetJob
            }),
        });

        if (!response.ok) {
            // response.ok가 아닐 경우 콘솔에 status와 message 출력
            const errorText = await response.text().catch(() => '');
            const errorJson = await response.json().catch(() => ({}));
            console.error('API 오류:', {
                status: response.status,
                statusText: response.statusText,
                message: errorJson.message || errorJson.error || errorText || '알 수 없는 오류',
                errorData: errorJson
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorJson.message || errorJson.error || errorText}`);
        }

        // 정상인 경우 JSON 데이터 console.log
        const data = await response.json();
        console.log('POST /api/users 응답:', data);
        return data;
    } catch (error) {
        // 오류 발생 시 상세 오류를 알 수 있도록 출력
        console.error('createUser 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error,
            requestBody: { nickname, major, targetJob }
        });
        throw error;
    }
};

// 헬스 체크 API
// GET: http://13.125.192.47:8090/api/health - 서버 헬스 체크
// 요청 파라미터: 없음
// 요청 바디: 없음
// 응답: string
export const getHealth = async () => {
    try {
        const response = await fetch('http://13.125.192.47:8090/api/health', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // response.ok가 아닐 경우 콘솔에 status와 message 출력
            const errorText = await response.text().catch(() => '');
            const errorJson = await response.json().catch(() => ({}));
            console.error('API 오류:', {
                status: response.status,
                statusText: response.statusText,
                message: errorJson.message || errorJson.error || errorText || '알 수 없는 오류',
                errorData: errorJson
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorJson.message || errorJson.error || errorText}`);
        }

        // 정상인 경우 응답 데이터 console.log (string 응답)
        const data = await response.text();
        console.log('GET /api/health 응답:', data);
        return data;
    } catch (error) {
        // 오류 발생 시 상세 오류를 알 수 있도록 출력
        console.error('getHealth 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error
        });
        throw error;
    }
};

// AI 컨트롤러 API
// POST: http://13.125.192.47:8090/api/interview/voice/analyze - 음성 분석
// 요청 파라미터: 없음
// 요청 바디: 없음
// 응답: 분석 결과 객체 (interviewId, questionId, userId, answerText)
export const analyzeInterviewVoice = async () => {
    try {
        const response = await fetch('http://13.125.192.47:8090/api/interview/voice/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => '');
            const errorJson = await response.json().catch(() => ({}));
            console.error('API 오류:', {
                status: response.status,
                statusText: response.statusText,
                message: errorJson.message || errorJson.error || errorText || '알 수 없는 오류',
                errorData: errorJson
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorJson.message || errorJson.error || errorText}`);
        }

        const data = await response.json();
        console.log('POST /api/interview/voice/analyze 응답:', data);
        return data;
    } catch (error) {
        console.error('analyzeInterviewVoice 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error
        });
        throw error;
    }
};

// GET: http://13.125.192.47:8090/api/interview/voice/health - 음성 분석 헬스 체크
// 요청 파라미터: 없음
// 요청 바디: 없음
// 응답: string
export const getInterviewVoiceHealth = async () => {
    try {
        const response = await fetch('http://13.125.192.47:8090/api/interview/voice/health', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => '');
            const errorJson = await response.json().catch(() => ({}));
            console.error('API 오류:', {
                status: response.status,
                statusText: response.statusText,
                message: errorJson.message || errorJson.error || errorText || '알 수 없는 오류',
                errorData: errorJson
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorJson.message || errorJson.error || errorText}`);
        }

        // 응답이 string이므로 text()로 받기
        const data = await response.text();
        console.log('GET /api/interview/voice/health 응답:', data);
        return data;
    } catch (error) {
        console.error('getInterviewVoiceHealth 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error
        });
        throw error;
    }
};

// 질문 생성 컨트롤러 API
// POST: http://13.125.192.47:8090/api/interview/question-gen - 면접 질문 생성
// 요청 파라미터: 없음
// 요청 바디(JSON): { userId: number, coverLetter: string }
// 응답: 질문 생성 결과 객체 (major, jobTitle, generatedAt, questions)
export const generateInterviewQuestions = async ({ userId, coverLetter }) => {
    try {
        const response = await fetch('http://13.125.192.47:8090/api/interview/question-gen', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                coverLetter: coverLetter
            }),
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => '');
            const errorJson = await response.json().catch(() => ({}));
            console.error('API 오류:', {
                status: response.status,
                statusText: response.statusText,
                message: errorJson.message || errorJson.error || errorText || '알 수 없는 오류',
                errorData: errorJson
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorJson.message || errorJson.error || errorText}`);
        }

        const data = await response.json();
        console.log('POST /api/interview/question-gen 응답:', data);
        return data;
    } catch (error) {
        console.error('generateInterviewQuestions 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error,
            requestBody: { userId, coverLetter }
        });
        throw error;
    }
};

// 면접 컨트롤러 API
// POST: http://13.125.192.47:8090/api/interview/audio - 면접 오디오 업로드
// 요청 파라미터: userId (query, integer), jobApplied (query, string)
// 요청 바디(JSON): { file: string }
// 응답: 면접 객체 (id, fileUrl, status, jobApplied, userId, requestTime, finishTime)
export const uploadInterviewAudio = async (userId, jobApplied, file) => {
    try {
        // query 파라미터 구성
        const params = new URLSearchParams();
        if (userId !== undefined && userId !== null) {
            params.append('userId', userId.toString());
        }
        if (jobApplied !== undefined && jobApplied !== null) {
            params.append('jobApplied', jobApplied.toString());
        }
        const queryString = params.toString();
        const url = queryString 
            ? `http://13.125.192.47:8090/api/interview/audio?${queryString}`
            : 'http://13.125.192.47:8090/api/interview/audio';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                file: file
            }),
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => '');
            const errorJson = await response.json().catch(() => ({}));
            console.error('API 오류:', {
                status: response.status,
                statusText: response.statusText,
                message: errorJson.message || errorJson.error || errorText || '알 수 없는 오류',
                errorData: errorJson
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorJson.message || errorJson.error || errorText}`);
        }

        const data = await response.json();
        console.log('POST /api/interview/audio 응답:', data);
        return data;
    } catch (error) {
        console.error('uploadInterviewAudio 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error,
            userId: userId,
            jobApplied: jobApplied,
            file: file
        });
        throw error;
    }
};

// GET: http://13.125.192.47:8090/api/interview/{interviewId} - 면접 조회
// 요청 파라미터: interviewId (path, integer)
// 요청 바디: 없음
// 응답: 면접 정보 객체 (fileUrl, jobApplied)
export const getInterviewById = async (interviewId) => {
    try {
        if (!interviewId) {
            throw new Error('interviewId는 필수입니다.');
        }

        const response = await fetch(`http://13.125.192.47:8090/api/interview/${interviewId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => '');
            const errorJson = await response.json().catch(() => ({}));
            console.error('API 오류:', {
                status: response.status,
                statusText: response.statusText,
                message: errorJson.message || errorJson.error || errorText || '알 수 없는 오류',
                errorData: errorJson
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorJson.message || errorJson.error || errorText}`);
        }

        const data = await response.json();
        console.log(`GET /api/interview/${interviewId} 응답:`, data);
        return data;
    } catch (error) {
        console.error('getInterviewById 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error,
            interviewId: interviewId
        });
        throw error;
    }
};

// 면접 학습 기록 컨트롤러 API
// POST: http://13.125.192.47:8090/api/interview-learning - 면접 학습 기록 생성
// 요청 파라미터: 있음 (구체적인 정보 제공되지 않음)
// 요청 바디(JSON): { userId, questionId, audioUrl, answerText, analysisResult, durationMs }
// 응답: 면접 학습 기록 객체
export const createInterviewLearning = async ({ userId, questionId, audioUrl, answerText, analysisResult, durationMs }) => {
    try {
        const response = await fetch('http://13.125.192.47:8090/api/interview-learning', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                questionId: questionId,
                audioUrl: audioUrl,
                answerText: answerText,
                analysisResult: analysisResult,
                durationMs: durationMs
            }),
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => '');
            const errorJson = await response.json().catch(() => ({}));
            console.error('API 오류:', {
                status: response.status,
                statusText: response.statusText,
                message: errorJson.message || errorJson.error || errorText || '알 수 없는 오류',
                errorData: errorJson
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorJson.message || errorJson.error || errorText}`);
        }

        const data = await response.json();
        console.log('POST /api/interview-learning 응답:', data);
        return data;
    } catch (error) {
        console.error('createInterviewLearning 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error,
            requestBody: { userId, questionId, audioUrl, answerText, analysisResult, durationMs }
        });
        throw error;
    }
};

// 피드백 컨트롤러 API
// POST: http://13.125.192.47:8090/api/feedback - 피드백 생성
// 요청 파라미터: 없음
// 요청 바디(JSON): { userId, jobApplied, introText, submissionTime }
// 응답: 피드백 객체 (id, userId, jobApplied, introText, submissionTime)
export const createFeedback = async ({ userId, jobApplied, introText, submissionTime }) => {
    try {
        const response = await fetch('http://13.125.192.47:8090/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                jobApplied: jobApplied,
                introText: introText,
                submissionTime: submissionTime
            }),
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => '');
            const errorJson = await response.json().catch(() => ({}));
            console.error('API 오류:', {
                status: response.status,
                statusText: response.statusText,
                message: errorJson.message || errorJson.error || errorText || '알 수 없는 오류',
                errorData: errorJson
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorJson.message || errorJson.error || errorText}`);
        }

        const data = await response.json();
        console.log('POST /api/feedback 응답:', data);
        return data;
    } catch (error) {
        console.error('createFeedback 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error,
            requestBody: { userId, jobApplied, introText, submissionTime }
        });
        throw error;
    }
};

// GET: http://13.125.192.47:8090/api/feedback/{id} - 피드백 조회
// 요청 파라미터: id (path, integer)
// 요청 바디: 없음
// 응답: 피드백 객체 (id, userId, jobApplied, introText, submissionTime)
export const getFeedbackById = async (id) => {
    try {
        if (!id) {
            throw new Error('id는 필수입니다.');
        }

        const response = await fetch(`http://13.125.192.47:8090/api/feedback/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => '');
            const errorJson = await response.json().catch(() => ({}));
            console.error('API 오류:', {
                status: response.status,
                statusText: response.statusText,
                message: errorJson.message || errorJson.error || errorText || '알 수 없는 오류',
                errorData: errorJson
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorJson.message || errorJson.error || errorText}`);
        }

        const data = await response.json();
        console.log(`GET /api/feedback/${id} 응답:`, data);
        return data;
    } catch (error) {
        console.error('getFeedbackById 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error,
            id: id
        });
        throw error;
    }
};

// GET: http://13.125.192.47:8090/api/feedback/introduction/{introductionId} - 자기소개서별 피드백 조회
// 요청 파라미터: introductionId (path, integer)
// 요청 바디: 없음
// 응답: 피드백 배열
export const getFeedbackByIntroductionId = async (introductionId) => {
    try {
        if (!introductionId) {
            throw new Error('introductionId는 필수입니다.');
        }

        const response = await fetch(`http://13.125.192.47:8090/api/feedback/introduction/${introductionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => '');
            const errorJson = await response.json().catch(() => ({}));
            console.error('API 오류:', {
                status: response.status,
                statusText: response.statusText,
                message: errorJson.message || errorJson.error || errorText || '알 수 없는 오류',
                errorData: errorJson
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorJson.message || errorJson.error || errorText}`);
        }

        const data = await response.json();
        console.log(`GET /api/feedback/introduction/${introductionId} 응답:`, data);
        return data;
    } catch (error) {
        console.error('getFeedbackByIntroductionId 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error,
            introductionId: introductionId
        });
        throw error;
    }
};

// GET: http://13.125.192.47:8090/api/feedback/interview/{interviewId} - 면접별 피드백 조회
// 요청 파라미터: interviewId (path, integer)
// 요청 바디: 없음
// 응답: 피드백 배열
export const getFeedbackByInterviewId = async (interviewId) => {
    try {
        if (!interviewId) {
            throw new Error('interviewId는 필수입니다.');
        }

        const response = await fetch(`http://13.125.192.47:8090/api/feedback/interview/${interviewId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => '');
            const errorJson = await response.json().catch(() => ({}));
            console.error('API 오류:', {
                status: response.status,
                statusText: response.statusText,
                message: errorJson.message || errorJson.error || errorText || '알 수 없는 오류',
                errorData: errorJson
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorJson.message || errorJson.error || errorText}`);
        }

        const data = await response.json();
        console.log(`GET /api/feedback/interview/${interviewId} 응답:`, data);
        return data;
    } catch (error) {
        console.error('getFeedbackByInterviewId 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error,
            interviewId: interviewId
        });
        throw error;
    }
};

// 인증 API
// GET: http://13.125.192.47:8090/api/logout-success - 로그아웃 성공 확인
// 요청 파라미터: 없음
// 요청 바디: 없음
// 응답: 로그아웃 응답 객체
export const getLogoutSuccess = async () => {
    try {
        const response = await fetch('http://13.125.192.47:8090/api/logout-success', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // response.ok가 아닐 경우 콘솔에 status와 message 출력
            const errorText = await response.text().catch(() => '');
            const errorJson = await response.json().catch(() => ({}));
            console.error('API 오류:', {
                status: response.status,
                statusText: response.statusText,
                message: errorJson.message || errorJson.error || errorText || '알 수 없는 오류',
                errorData: errorJson
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorJson.message || errorJson.error || errorText}`);
        }

        // 정상인 경우 JSON 데이터 console.log
        const data = await response.json();
        console.log('GET /api/logout-success 응답:', data);
        return data;
    } catch (error) {
        // 오류 발생 시 상세 오류를 알 수 있도록 출력
        console.error('getLogoutSuccess 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error
        });
        throw error;
    }
};



//호환성을 위해서 혹시 물라서 추가한 부분인데
export const api = {
    getUsers: () =>
        fetch(`${BASE_URL}/api/users`).then(res => res.json()),
};
//이많큼 4줄은 삭제해도 무방함

//get
    fetch('http://13.125.192.47:8090/api/users')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(errer => {
        console.error('Error:', errer);
    });

fetch('http://13.125.192.47:8090/api/users/{id}')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(errer => {
        console.error('Error:', errer);
    });
    
fetch('http://13.125.192.47:8090/api/interview/voice/health')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(errer => {
        console.error('Error:', errer);
    });

fetch('http://13.125.192.47:8090/api/feedback/{id}')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(errer => {
        console.error('Error:', errer);
    });

fetch('http://13.125.192.47:8090/api/feedback/introduction/{introductionId}')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(errer => {
        console.error('Error:', errer);
    });

fetch('http://13.125.192.47:8090/api/feedback/interview/{interviewId}')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(errer => {
        console.error('Error:', errer);
    });

//post
fetch('http://13.125.192.47:8090/api/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nickname: "string",
        email: "string",
        major: "string",
        targetJob: "string"
    }),
});

fetch('http://13.125.192.47:8090/api/interview/voice/analyze', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        interviewId: 1,
        questionId: "q-1",
        userId: 10,
        answerText: "string"
    })
})

fetch('http://13.125.192.47:8090/api/interview/question-gen', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        userId: 10,
        coverLetter: "저는 백엔드 개발자로 성장하기 위해..."
    }),
});

fetch('http://13.125.192.47:8090/api/interview/audio', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        userId: "integer",
        jobApplied: "string"
    }),
});

fetch('http://13.125.192.47:8090/api/interview-learning', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        userId: 0,
        questionId: 0,
        audioUrl: "string",
        answerText: "string",
        analysisResult: "string",
        durationMs: 0
    }),
});

fetch('http://13.125.192.47:8090/api/feedback', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        userId: 0,
        jobApplied: "string",
        introText: "string",
        submissionTime: "2025-11-27T01:%%14:49.145Z"
    }),
});

//patch
fetch('http://13.125.192.47:8090/api/users/{id}/profile', {
    method: 'PATCH',
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        nickname: "string",
        major: "string",
        targetJob: "string"
    })
})
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));


export default fetchApi; // 기본 래퍼 함수를 export

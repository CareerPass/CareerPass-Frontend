// fetch는 기본 브라우저 API이므로 별도의 import가 필요 없습니다.
// Vite 환경에서는 import.meta.env를 사용하지만, 호환성을 위해 둘 다 지원
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 기본 fetch 래퍼 함수
const fetchApi = async (endpoint, options = {}) => {
    try {
        // body가 FormData인 경우 Content-Type 헤더를 설정하지 않음
        // (브라우저가 자동으로 multipart/form-data + boundary를 설정)
        const isFormData = options.body instanceof FormData;
        
        const headers = isFormData 
            ? { ...options.headers } // FormData일 때는 Content-Type을 추가하지 않음
            : {
                'Content-Type': 'application/json',
                ...options.headers,
            };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: headers,
        });

        // 4xx, 5xx 에러 처리
        if (!response.ok) {
            // 에러 응답도 Content-Type에 따라 처리
            const contentType = response.headers.get("content-type");
            let errorData = {};
            if (contentType && contentType.includes("application/json")) {
                errorData = await response.json().catch(() => ({}));
            } else {
                const errorText = await response.text().catch(() => '');
                errorData = { error: errorText || `HTTP error! status: ${response.status}` };
            }
            // 사용자 정의 에러 객체를 throw
            throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
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
// POST: http://13.125.192.47:8090/api/feedback/interview/ai - 면접 답변 제출 및 AI 분석
// 요청 바디: multipart/form-data (meta: JSON Blob, file: File/Blob)
// 응답: AnswerAnalysisResultDto (transcript, score, timeMs, fluency, contentDepth, structure, fillerCount, improvements, strengths, risks)
// 
// 이 함수는 meta + file을 동시에 전송하는 단일 엔드포인트입니다.
// meta 구조: { interviewId, userId, questionId, questionText, resumeContent, jobApplied }
export const submitInterviewAnswer = async ({
    interviewId,
    userId,
    questionId,
    questionText,
    resumeContent,
    jobApplied,
    file, // Blob 또는 File
}) => {
    try {
        // 필수 파라미터 검증
        if (!file) {
            throw new Error('면접 음성 파일(file)이 없습니다.');
        }

        // meta 객체 구성
        const meta = {
            interviewId: interviewId || null,
            userId: userId || null,
            questionId: questionId || null,
            questionText: questionText || '',
            resumeContent: resumeContent || '',
            jobApplied: jobApplied || '',
        };

        // FormData 생성
        const formData = new FormData();
        
        // meta를 JSON 문자열로 변환하여 Blob으로 추가
        const metaJson = JSON.stringify(meta);
        const metaBlob = new Blob([metaJson], { type: 'application/json' });
        formData.append('meta', metaBlob);

        // file 추가
        formData.append('file', file, `answer-${Date.now()}.webm`);

        console.log('submitInterviewAnswer 요청:', {
            meta: meta,
            fileSize: file.size,
            fileName: file.name || 'audio.webm'
        });

        const response = await fetch('http://13.125.192.47:8090/api/feedback/interview/ai', {
            method: 'POST',
            // FormData를 사용하면 브라우저가 자동으로 multipart/form-data와 boundary를 설정
            // Content-Type 헤더를 명시적으로 설정하지 않음 (415 에러 방지)
            // headers에 Content-Type을 포함하지 않음
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => '');
            let errorJson = {};
            try {
                errorJson = JSON.parse(errorText);
            } catch {
                // JSON 파싱 실패 시 errorText 그대로 사용
            }
            console.error('Interview AI API 오류:', {
                status: response.status,
                statusText: response.statusText,
                message: errorJson.message || errorJson.error || errorText || '알 수 없는 오류',
                errorData: errorJson
            });
            throw new Error(`Interview AI API 오류: HTTP ${response.status} ${errorJson.message || errorJson.error || errorText}`);
        }

        // 응답 Content-Type에 따라 처리
        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();
            // 텍스트 응답이 JSON 형식인지 확인
            try {
                data = JSON.parse(text);
            } catch {
                // JSON이 아니면 텍스트 그대로 반환
                data = text;
            }
        }
        console.log('POST /api/feedback/interview/ai 응답:', data);
        return data;
    } catch (error) {
        console.error('submitInterviewAnswer 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error,
            interviewId: interviewId,
            userId: userId,
            questionId: questionId,
            file: file
        });
        throw error;
    }
};

// [DEPRECATED] 이 함수는 더 이상 사용하지 않습니다. submitInterviewAnswer를 사용하세요.
// POST: http://13.125.192.47:8090/api/interview/audio - 면접 오디오 업로드 (구버전)
// 이 함수는 호환성을 위해 유지되지만, 새로운 코드에서는 submitInterviewAnswer를 사용해야 합니다.
export const uploadInterviewAudio = async (userId, jobApplied, file) => {
    console.warn('⚠️ uploadInterviewAudio는 더 이상 사용하지 않습니다. submitInterviewAnswer를 사용하세요.');
    // 호환성을 위해 빈 객체 반환 (실제로는 사용하지 않음)
    return {};
};

// GET: http://13.125.192.47:8090/api/interview/{interviewId} - 면접 조회
// 요청 파라미터: interviewId (path, integer)
// 요청 바디: 없음
// 응답 구조: { "fileUrl": "string", "jobApplied": "string" }
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
            // response body를 한 번만 읽기 (text로 먼저 읽고, JSON 파싱 시도)
            let errorText = '';
            let errorJson = null;
            
            try {
                errorText = await response.text();
                // text가 비어있지 않고 JSON 형식이면 파싱 시도
                if (errorText && errorText.trim().startsWith('{')) {
                    try {
                        errorJson = JSON.parse(errorText);
                    } catch {
                        // JSON 파싱 실패 시 errorText 그대로 사용
                    }
                }
            } catch (textError) {
                console.warn('응답 body 읽기 실패:', textError);
            }

            const errorMessage = errorJson?.message || errorJson?.error || errorJson?.detail || errorText || '알 수 없는 오류';
            
            console.error('API 오류:', {
                status: response.status,
                statusText: response.statusText,
                url: `http://13.125.192.47:8090/api/interview/${interviewId}`,
                message: errorMessage,
                errorData: errorJson
            });
            
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
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

// [DEPRECATED] 이 함수는 더 이상 사용하지 않습니다. submitInterviewAnswer를 사용하세요.
// POST: http://13.125.192.47:8090/api/feedback/interview/ai - 면접 AI 피드백 분석 (구버전)
// 이 함수는 meta만 보내거나 file만 보내는 방식으로 사용되었지만,
// 백엔드 스펙상 meta + file을 동시에 보내야 하므로 submitInterviewAnswer로 대체되었습니다.
export const getInterviewAIFeedback = async (meta, file) => {
    console.warn('⚠️ getInterviewAIFeedback는 더 이상 사용하지 않습니다. submitInterviewAnswer를 사용하세요.');
    // 호환성을 위해 빈 객체 반환 (실제로는 사용하지 않음)
    return {};
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

fetch('http://13.125.192.47:8090/api/feedback/interview/ai', {
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


// 피드백 컨트롤러 API
// POST: http://13.125.192.47:8090/api/feedback/introduction/ai - 자기소개서 AI 피드백 생성
// 요청 파라미터: 없음
// 요청 바디(JSON): { userId: number, resumeContent: string }
// 응답: 피드백 객체 (feedback: string, userId: number)
export const createIntroductionAIFeedback = async (userId, resumeContent) => {
    try {
        if (!userId || !resumeContent) {
            throw new Error('userId와 resumeContent는 필수입니다.');
        }

        const response = await fetch('http://13.125.192.47:8090/api/feedback/introduction/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                resumeContent: resumeContent
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

        // 응답 Content-Type에 따라 처리
        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();
            // 텍스트 응답이 JSON 형식인지 확인
            try {
                data = JSON.parse(text);
            } catch {
                // JSON이 아니면 텍스트 그대로 반환
                data = text;
            }
        }
        console.log('POST /api/feedback/introduction/ai 응답:', data);
        return data;
    } catch (error) {
        // 오류 발생 시 상세 오류를 알 수 있도록 출력
        console.error('createIntroductionAIFeedback 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error,
            userId: userId,
            resumeContent: resumeContent
        });
        throw error;
    }
};

// 자기소개서 AI 피드백 API
// POST: {VITE_REACT_APP_AI_SERVER}/resume/feedback - 자기소개서 AI 피드백 생성
// 요청 파라미터: 없음
// 요청 바디(JSON): { userId: number, resumeContent: string }
// 응답: 피드백 객체 (feedback: string, userId: number)
// 학습 프로필 조회 API
// GET: {API_BASE_URL}/api/users/{userId} - 사용자 학습 프로필 조회
// 요청 파라미터: userId (path, number, 기본값: 1)
// 요청 바디: 없음
// 응답: LearningProfileResponse { id, nickname, email, major, targetJob, profileCompleted, recentInterviews, recentIntroductions }
export async function fetchUserLearningProfile(userId = 1) {
  try {
    const backendBaseUrl = API_BASE_URL || 'http://13.125.192.47:8090';
    const url = `${backendBaseUrl}/api/users/${userId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`failed to load learning profile: HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('GET /api/users/{userId} 응답:', data);
    return data;
  } catch (error) {
    console.error('fetchUserLearningProfile 오류:', {
      message: error.message,
      stack: error.stack,
      error: error,
      userId: userId
    });
    throw error;
  }
}

export async function requestResumeFeedback(userId, resumeContent) {
  try {
    if (!userId || !resumeContent) {
      throw new Error('userId와 resumeContent는 필수입니다.');
    }

    // 서버 연결 시 사용할 주소
    const aiServerUrl = import.meta.env.VITE_REACT_APP_AI_SERVER || 'http://13.125.192.47:8088';
    // Swagger 문서에서 확인한 실제 엔드포인트: /resume/resume/feedback
    const url = `${aiServerUrl}/resume/resume/feedback`;

    console.log('AI 서버 URL:', aiServerUrl);
    console.log('요청 URL:', url);

    // 서버 연결 시도
    const response = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      mode: "cors",
      credentials: "omit",
      body: JSON.stringify({ 
        userId: Number(userId), 
        resumeContent: String(resumeContent)
      }),
    });

    if (!response.ok) {
      // response body를 한 번만 읽기 (text로 먼저 읽고, JSON 파싱 시도)
      let errorText = '';
      let errorJson = null;
      
      try {
        errorText = await response.text();
        // text가 비어있지 않고 JSON 형식이면 파싱 시도
        if (errorText && errorText.trim().startsWith('{')) {
          try {
            errorJson = JSON.parse(errorText);
          } catch {
            // JSON 파싱 실패 시 errorText 그대로 사용
          }
        }
      } catch (textError) {
        console.warn('응답 body 읽기 실패:', textError);
      }

      const errorMessage = errorJson?.detail || errorJson?.message || errorJson?.error || errorText || '알 수 없는 오류';
      
      console.error('API 오류:', {
        status: response.status,
        statusText: response.statusText,
        url: url,
        message: errorMessage,
        errorData: errorJson
      });
      
      // 404 에러인 경우 사용자 친화적인 메시지
      if (response.status === 404) {
        throw new Error('서버에서 요청한 경로를 찾을 수 없습니다. 서버 설정을 확인해주세요.');
      }
      
      throw new Error(`서버 오류 (${response.status}): ${errorMessage}`);
    }

    const data = await response.json();
    console.log('POST /resume/resume/feedback 응답:', data);
    return data;
  } catch (error) {
    console.error('requestResumeFeedback 오류 상세:', {
      message: error.message,
      stack: error.stack,
      error: error,
      userId: userId,
      resumeContentLength: resumeContent?.length || 0
    });
    
    // 연결 타임아웃 에러인 경우 더 명확한 메시지
    if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION')) {
      const aiServerUrl = import.meta.env.VITE_REACT_APP_AI_SERVER || 'http://13.125.192.47:8088';
      throw new Error(`서버에 연결할 수 없습니다. ${aiServerUrl} 서버가 실행 중인지 확인해주세요.`);
    }
    
    throw error;
  }
}

export default fetchApi; // 기본 래퍼 함수를 export

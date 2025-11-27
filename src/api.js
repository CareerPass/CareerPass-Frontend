// fetch는 기본 브라우저 API이므로 별도의 import가 필요 없습니다.
// Vite 환경에서는 import.meta.env를 사용하지만, 호환성을 위해 둘 다 지원
const API_BASE_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://13.125.192.47:8090';

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

// 사용자 API
// GET: http://13.125.192.47:8090/api/users - 모든 사용자 조회
// 요청 파라미터: 없음, 요청 바디: 없음
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

// POST: http://13.125.192.47:8090/api/users - 사용자 생성
// 요청 파라미터: 없음
// 요청 바디(JSON): request body (nickname, email, major, targetJob 등)
// 응답: 사용자 객체 (nickname, email, major, targetJob)
export const createUser = async (requestBody) => {
    try {
        const response = await fetch('http://13.125.192.47:8090/api/users', {
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
        console.log('POST /api/users 응답:', data);
        return data;
    } catch (error) {
        // 오류 발생 시 상세 오류를 알 수 있도록 출력
        console.error('createUser 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error,
            requestBody: requestBody
        });
        throw error;
    }
};

// GET: http://13.125.192.47:8090/api/users/{id} - 특정 사용자 조회
export const getUserById = (id) => fetchApi(`/api/users/${id}`);

// PATCH: http://13.125.192.47:8090/api/users/{id}/profile - 사용자 프로필 업데이트
// 요청 파라미터: id (path variable, integer)
// 요청 바디(JSON): { nickname: "string", major: "string", targetJob: "string" }
// 응답: 사용자 객체 (nickname, email, major, targetJob, profileCompleted, recentInterviews, recentIntroductions)
export const updateUserProfile = async (id, requestBody) => {
    try {
        const response = await fetch(`http://13.125.192.47:8090/api/users/${id}/profile`, {
            method: 'PATCH',
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
        console.log(`PATCH /api/users/${id}/profile 응답:`, data);
        return data;
    } catch (error) {
        // 오류 발생 시 상세 오류를 알 수 있도록 출력
        console.error('updateUserProfile 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error,
            userId: id,
            requestBody: requestBody
        });
        throw error;
    }
};

// PATCH: http://13.125.192.47:8090/api/users/{id} - 사용자 정보 업데이트 (기존 호환성 유지)
export const updateUser = (id, data) => fetchApi(`/api/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
});


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

// 사용자 인증 API
// GET: http://13.125.192.47:8090/api/me - 현재 사용자 정보 조회
// 요청 파라미터: 없음
// 요청 바디: 없음
// 응답: 사용자 정보 객체
export const getMe = async () => {
    try {
        const response = await fetch('http://13.125.192.47:8090/api/me', {
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
        console.log('GET /api/me 응답:', data);
        return data;
    } catch (error) {
        // 오류 발생 시 상세 오류를 알 수 있도록 출력
        console.error('getMe 오류 상세:', {
            message: error.message,
            stack: error.stack,
            error: error
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


export default fetchApi; // 기본 래퍼 함수를 export

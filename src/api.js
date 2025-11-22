// fetch는 기본 브라우저 API이므로 별도의 import가 필요 없습니다.
const API_BASE_URL = process.env.REACT_APP_API_URL;

// 기본 fetch 래퍼 함수
const fetchApi = async (endpoint, options = {}) => {
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
};


// 사용자
export const getUsers = () => fetchApi('/api/users');

export const createUser = (data) => fetchApi('/api/users', {
    method: 'POST',
    body: JSON.stringify(data),
});

export const updateUser = (id, data) => fetchApi(`/api/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
});


export default fetchApi; // 기본 래퍼 함수를 export
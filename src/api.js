const BASE_URL = 'http://13.125.192.47:8090';

//get
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
        submissionTime: "2025-11-27T01:14:49.145Z"
    }),
});
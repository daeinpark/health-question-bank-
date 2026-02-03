// 전역 변수
let currentQuestion = 0;
let selectedAnswer = null;
let showingExplanation = false;
let timer = 300; // 5분
let timerInterval;

// 샘플 문제 데이터
const questions = {
    '운동생리학': [
        {
            question: "다음 중 운동생리학의 기본 원리로 옳은 것은?",
            options: [
                "1. 과부하의 원리",
                "2. 특이성의 원리", 
                "3. 가역성의 원리",
                "4. 모든 것이 옳다"
            ],
            correct: 3,
            explanation: "운동생리학의 기본 원리에는 과부하의 원리(점진적으로 운동 강도를 증가), 특이성의 원리(특정 운동에 특정 적응), 가역성의 원리(운동 중단 시 효과 감소)가 모두 포함됩니다."
        },
        {
            question: "유산소 운동 시 주요 에너지 시스템은?",
            options: [
                "1. ATP-PC 시스템",
                "2. 젖산 시스템",
                "3. 유산소 시스템", 
                "4. 무산소 시스템"
            ],
            correct: 2,
            explanation: "유산소 운동에서는 산소를 이용하여 탄수화물과 지방을 분해하는 유산소 시스템이 주요 에너지원으로 사용됩니다."
        }
    ],
    '건강체력평가': [
        {
            question: "건강 관련 체력 요소가 아닌 것은?",
            options: [
                "1. 심폐지구력",
                "2. 근력",
                "3. 유연성",
                "4. 민첩성"
            ],
            correct: 3,
            explanation: "민첩성은 기능 관련 체력 요소입니다. 건강 관련 체력 요소는 심폐지구력, 근력, 근지구력, 유연성, 신체구성입니다."
        }
    ]
};

// 퀴즈 시작
function startQuiz(subject) {
    document.getElementById('quiz-subject').textContent = subject;
    document.getElementById('quiz-modal').style.display = 'block';
    currentQuestion = 0;
    selectedAnswer = null;
    showingExplanation = false;
    startTimer();
    loadQuestion(subject);
}

// 문제 로드
function loadQuestion(subject) {
    const questionData = questions[subject] || questions['운동생리학'];
    const question = questionData[currentQuestion] || questionData[0];
    
    document.querySelector('.question-number').textContent = `문제 ${currentQuestion + 1}/${questionData.length}`;
    document.querySelector('.question-content h3').textContent = question.question;
    
    const optionsContainer = document.querySelector('.options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        button.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(button);
    });
    
    document.getElementById('explanation').style.display = 'none';
    document.getElementById('explanation').querySelector('p').textContent = question.explanation;
}

// 답 선택
function selectAnswer(index) {
    if (showingExplanation) return;
    
    selectedAnswer = index;
    const options = document.querySelectorAll('.option');
    const subject = document.getElementById('quiz-subject').textContent;
    const questionData = questions[subject] || questions['운동생리학'];
    const question = questionData[currentQuestion] || questionData[0];
    
    options.forEach((option, i) => {
        option.classList.remove('selected', 'correct', 'wrong');
        if (i === index) {
            option.classList.add('selected');
        }
    });
    
    // 정답 표시
    setTimeout(() => {
        options[question.correct].classList.add('correct');
        if (index !== question.correct) {
            options[index].classList.add('wrong');
        }
        
        document.getElementById('explanation').style.display = 'block';
        showingExplanation = true;
    }, 1000);
}

// 타이머
function startTimer() {
    timer = 300;
    updateTimer();
    timerInterval = setInterval(() => {
        timer--;
        updateTimer();
        if (timer <= 0) {
            clearInterval(timerInterval);
            alert('시간이 종료되었습니다!');
        }
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    document.querySelector('.timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 이전/다음 문제
function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        selectedAnswer = null;
        showingExplanation = false;
        const subject = document.getElementById('quiz-subject').textContent;
        loadQuestion(subject);
    }
}

function nextQuestion() {
    const subject = document.getElementById('quiz-subject').textContent;
    const questionData = questions[subject] || questions['운동생리학'];
    
    if (currentQuestion < questionData.length - 1) {
        currentQuestion++;
        selectedAnswer = null;
        showingExplanation = false;
        loadQuestion(subject);
    } else {
        alert('모든 문제를 완료했습니다!');
        closeModal();
    }
}

// 모달 닫기
function closeModal() {
    document.getElementById('quiz-modal').style.display = 'none';
    clearInterval(timerInterval);
}

// 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
    // 모달 닫기 버튼
    document.querySelector('.close').onclick = closeModal;
    
    // 모달 외부 클릭 시 닫기
    window.onclick = function(event) {
        const modal = document.getElementById('quiz-modal');
        if (event.target === modal) {
            closeModal();
        }
    }
    
    // 부드러운 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// 통계 애니메이션
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        const numericValue = parseInt(finalValue.replace(/[^0-9]/g, ''));
        let currentValue = 0;
        const increment = numericValue / 50;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= numericValue) {
                stat.textContent = finalValue;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(currentValue).toLocaleString();
            }
        }, 30);
    });
}

// 페이지 로드 시 애니메이션 실행
window.addEventListener('load', () => {
    setTimeout(animateStats, 1000);
});
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyACL2uv7OrlEi1aStBwpGAB0gMmlnQ0S9I",
    authDomain: "ryannwebsite.firebaseapp.com",
    projectId: "ryannwebsite",
    storageBucket: "ryannwebsite.firebasestorage.app",
    messagingSenderId: "789253952535",
    appId: "1:789253952535:web:e740b05f6473926af2f852",
    measurementId: "G-EN9P6J2DGN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Quiz settings
const questions = [
    {
        question: "What is the capital of France?",
        choices: ["Paris", "London", "Berlin"],
        correct: "Paris"
    },
    {
        question: "What is the capital of Germany?",
        choices: ["Munich", "Berlin", "Frankfurt"],
        correct: "Berlin"
    },
    {
        question: "What is the capital of Italy?",
        choices: ["Rome", "Milan", "Naples"],
        correct: "Rome"
    },
    {
        question: "What is the capital of Spain?",
        choices: ["Madrid", "Barcelona", "Seville"],
        correct: "Madrid"
    },
    {
        question: "What is the capital of Portugal?",
        choices: ["Lisbon", "Porto", "Coimbra"],
        correct: "Lisbon"
    }
];

let currentQuestion = 0;
let userScore = 0;
let userName = null;

function startQuiz() {
    userName = prompt("Enter your name:");
    if (!userName) return; // Cancelled prompt
    renderQuestion();
}

function renderQuestion() {
    // If no more questions, finish the quiz
    if (currentQuestion >= questions.length) {
        finishQuiz();
        return;
    }
    const questionEl = document.getElementById("question");
    const answersEl = document.getElementById("answers");
    answersEl.innerHTML = ""; // clear previous answers

    const current = questions[currentQuestion];
    questionEl.innerText = current.question;

    current.choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.innerText = choice;
        btn.className = "answer";
        btn.addEventListener("click", () => submitAnswer(choice));
        answersEl.appendChild(btn);
    });
}

function submitAnswer(answer) {
    const current = questions[currentQuestion];
    if (answer === current.correct) {
        userScore += 10;
    }
    currentQuestion++;
    renderQuestion();
}

function finishQuiz() {
    const quizDiv = document.getElementById("quiz");
    quizDiv.innerHTML = `<p>You finished! Your score: ${userScore}</p>`;

    // Save the score to Firebase
    addDoc(collection(db, "scores"), {
        name: userName,
        score: userScore
    })
    .then(() => {
        console.log("Score saved!");
        loadLeaderboard();
    })
    .catch(error => console.error("Error saving score:", error));
}

function loadLeaderboard() {
    const leaderboard = document.getElementById("leaderboard");
    const q = query(collection(db, "scores"), orderBy("score", "desc"), limit(5));
    leaderboard.innerHTML = "";

    getDocs(q)
    .then(snapshot => {
        snapshot.forEach(doc => {
            const data = doc.data();
            const li = document.createElement("li");
            li.innerText = `${data.name}: ${data.score} points`;
            leaderboard.appendChild(li);
        });
    })
    .catch(error => console.error("Error loading leaderboard:", error));
}

// Expose functions to the global scope if needed
window.startQuiz = startQuiz;
window.loadLeaderboard = loadLeaderboard;

// Start the quiz when page loads
window.onload = () => {
    loadLeaderboard();
    startQuiz();
};
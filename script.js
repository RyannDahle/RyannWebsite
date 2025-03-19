import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    limit,
    where // Add this line
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";




function finishQuiz() {
    const quizDiv = document.getElementById("quiz");
    quizDiv.innerHTML = `<p>You finished! Your score: ${userScore}</p>`;
    
    // First, get all existing scores to determine placement
    const allScoresQuery = query(collection(db, "scores"), orderBy("score", "desc"));
    
    getDocs(allScoresQuery)
    .then(snapshot => {
        const allScores = snapshot.docs.map(doc => doc.data().score);
        // Count scores higher than the user's score for placement
        const higherScores = allScores.filter(score => score > userScore);
        const placement = higherScores.length + 1;
        const totalPlayers = allScores.length + 1; // +1 to include current player
        
        // Display the placement
        const placementInfo = document.createElement("p");
        placementInfo.innerText = `Your placement: ${placement} out of ${totalPlayers}`;
        quizDiv.appendChild(placementInfo);
        
        // Save the score to Firebase
        return addDoc(collection(db, "scores"), {
            name: userName,
            score: userScore
        });
    })
    .then(() => {
        console.log("Score saved!");
        loadLeaderboard();
    })
    .catch(error => console.error("Error:", error));
}




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
const BONUS_QUESTION_INDEX = 2; // Index of the bonus question in the array
// Quiz settings
const questions = [
    {
        question: "What is the smallest prime number?",
        choices: ["1", "2", "3"],
        correct: "2"
    },
    {
        question: "What is Taylor Swift's middle name?",
        choices: ["Marie", "Grace", "Alison"],
        correct: "Alison"
    },
    {
        question: "Which actress plays Brooke Davis in the TV show One Tree Hill?",
        choices: ["Sophia Bush", "Hilarie Burton", "Brittany Snow"],
        correct: "Sophia Bush"
    },
    {
        question: "Which Pixar film features the song 'Life is a Highway'?",
        choices: ["Cars", "Cars 2", "Cars 3"],
        correct: "Cars"
    },
    {
        question: "Which Brother duo hosts the Youtube channel Crash Course?",
        choices: ["The Property Brothers", "The Green Brothers", "The Sprouse Brothers"],
        correct: "The Green Brothers"
    }
];

let currentQuestion = 0;
let userScore = 0;
let userName = null;

async function startQuiz() {
    userName = prompt("Enter your name:");
    if (!userName) return; // Cancelled prompt

    // Check if the user has already played
    const userQuery = query(collection(db, "scores"), where("name", "==", userName));
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
        alert("Hey! Are you trying to cheat? You already played!");
        return;
    }

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
        // Check if the current question is the bonus question
        if (currentQuestion === BONUS_QUESTION_INDEX) {
            userScore += 20; // Double points for the bonus question
        } else {
            userScore += 10;
        }
    }
    
    currentQuestion++;
    renderQuestion();
}

// function finishQuiz() {
//     const quizDiv = document.getElementById("quiz");
//     quizDiv.innerHTML = `<p>You finished! Your score: ${userScore}</p>`;

//     // Save the score to Firebase
//     addDoc(collection(db, "scores"), {
//         name: userName,
//         score: userScore
//     })
//     .then(() => {
//         console.log("Score saved!");
//         loadLeaderboard();
//     })
//     .catch(error => console.error("Error saving score:", error));
// }

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
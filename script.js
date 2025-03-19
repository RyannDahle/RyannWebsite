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
        question: "What is the name of the company where the severed employees work?",
        choices: ["Eagan Enterprises", "Lumon Industries", "Macrodata Refinement"],
        correct: "Lumon Industries"
    },
    {
        question: "What is the name of the department where Mark works?",
        choices: ["Optics and Design", "Macrodata Refinement", "Wellness Center"],
        correct: "Macrodata Refinement"
    },
    {
        question: "What is the name of the procedure that separates work and personal memories?",
        choices: ["Partitioning", "Severance", "Memory Split"],
        correct: "Severance"
    },
    {
        question: "Who is the founder of Lumon Industries?",
        choices: ["Mark Scout", "Helly R.", "Kier Eagan"],
        correct: "Kier Eagan"
    },
    {
        question: "What is the name of the wellness counselor?",
        choices: ["Ms. Cobel", "Ms. Selvig", "Ms. Casey"],
        correct: "Ms. Casey"
    },
    {
        question: "What is the name of the mysterious book that influences the employees?",
        choices: ["The Lumon Handbook", "The You You Are", "The Eagan Doctrine"],
        correct: "The You You Are"
    },
    {
        question: "What is the name of the rebellious employee who escapes?",
        choices: ["Dylan", "Irving", "Petey"],
        correct: "Petey"
    },
    {
        question: "What is the name of the device used to sever memories?",
        choices: ["The Neural Splitter", "The Severance Chip", "The Partition Implant"],
        correct: "The Severance Chip"
    },
    {
        question: "What is the name of the mysterious painting in the office?",
        choices: ["The Eagan Portrait", "The Macrodata Vision", "The Four Tempers"],
        correct: "The Four Tempers"
    },

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

function displayQuestionsAndAnswers() {
    const quizDiv = document.getElementById("quiz");
    
    // Create a section for questions and answers
    const qaSection = document.createElement("div");
    qaSection.className = "questions-answers";
    qaSection.innerHTML = "<h3>Quiz Questions and Answers</h3>";
    
    // Loop through all questions
    questions.forEach((q, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.className = "qa-item";
        
        // Add bonus indicator
        const bonusText = (index === BONUS_QUESTION_INDEX) ? " (Bonus Question)" : "";
        
        questionDiv.innerHTML = `
            <p><strong>Question ${index + 1}${bonusText}:</strong> ${q.question}</p>
            <p><strong>Correct answer:</strong> ${q.correct}</p>
        `;
        qaSection.appendChild(questionDiv);
    });
    
    // Append to the quiz div
    quizDiv.appendChild(qaSection);
}

// Store the original finishQuiz function
const originalFinishQuiz = finishQuiz;

// Override with enhanced version
finishQuiz = function() {
    // Call the original first
    originalFinishQuiz();
    
    // Add a small delay to ensure the original finishQuiz has completed its DOM updates
    setTimeout(displayQuestionsAndAnswers, 100);
};



function loadLeaderboard() {
    const leaderboard = document.getElementById("leaderboard");
    const q = query(collection(db, "scores"), orderBy("score", "desc"), limit(10));
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
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
// Prevent the website from triggering the print dialog on load
window.onbeforeprint = null;
window.onafterprint = null;


function finishQuiz() {
    const quizDiv = document.getElementById("quiz");
    quizDiv.innerHTML = `<p>You finished!</p>`;
    
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
const BONUS_QUESTION_INDEX = 20; // Index of the bonus question in the array
// Quiz settings
const questions = [
    {
        question: "What was Ryann’s first residency interview invite?",
        choices: ["University of South Alabama", "LSU-Shreveport", "Marshall University", "Emory University", "Indiana University"],
        correct: "Marshall University"
    },
    {
        question: "If Ryann didn’t do med/peds what specialty would he do?",
        choices: ["Radiology", "Pediatrics", "Anesthesiology", "Radiation Oncology", "Child Neurology", "Physical Medicine and Rehabilitation"],
        correct: "Radiation Oncology"
    },
    {
        question: "Which baby did Ryann help deliver?",
        choices: ["Ella", "Emersyn", "Josie"],
        correct: "Emersyn"
    },
    {
        question: "What is Ryann’s GPA?",
        choices: ["2.5-2.75", "2.75-3.00", "3.00-3.25", "3.25-3.50", "3.5-3.75", "3.75-4.00"],
        correct: "3.75-4.00"
    },
    {
        question: "What song could Ryann sing every word in karaoke?",
        choices: ["Tennessee Whiskey", "Free Fallin", "My Humps", "Girls Just Want to Have Fun", "Accidentally in Love"],
        correct: "My Humps"
    },
    {
        question: "What song could Hannah sing every word in Karaoke?",
        choices: ["Sweet Escape", "Pink Pony Club", "I Will Survive", "Zombie", "The Real Slim Shady"],
        correct: "Sweet Escape"
    },
    {
        question: "What food did Noah eat way too much of and got a tummy ache the night Ryann and Hannah decided to go to Meharry?",
        choices: ["Macaroni and Cheese", "Pasta Salad", "Spinach Dip", "Pizza Rolls", "Deviled Eggs"],
        correct: "Pasta Salad"
    },
    {
        question: "What was Ryann’s favorite organ system block in medical school?",
        choices: ["Neurology", "Reproductive systems", "Endocrine", "Hematology", "Nephrology", "Cardiology"],
        correct: "Cardiology"
    },
    {
        question: "What does Rosie always ask Ryann to get her?",
        choices: ["Raffle Tickets", "Ice Cream", "Cookies", "Donuts", "Colored Pencils"],
        correct: "Donuts"
    },
    {
        question: "What is Ryann’s career goal/What type of Dr does he want to be?",
        choices: ["Adolescent Medicine", "Hematologist/Oncologist", "Cardiologist", "Neonatologist", "Pediatric Hospitalist", "Pulmonology/Critical Care"],
        correct: "Hematologist/Oncologist"
    },
    {
        question: "What is Ryann’s go to Coffee order?",
        choices: ["Pumpkin spice latte", "Chai latte with a shot of espresso", "Hot Vanilla Latte", "Iced Caramel Latte", "Iced Americano"],
        correct: "Hot Vanilla Latte"
    },
    {
        question: "What is Hannah’s go to coffee order?",
        choices: ["Iced Caramel Latte", "Hot Caramel Latte", "Cold Brew", "Frappuccino", "Brown Sugar Shaken Espresso"],
        correct: "Iced Caramel Latte"
    },
    {
        question: "How many interviews did Ryann receive?",
        choices: ["5-10", "10-15", "15-20", "20-25", "25-30", "30+"],
        correct: "20-25"
    },
    {
        question: "What is Ryann doing his research on?",
        choices: ["Tau2 Gene associated with Alzheimer’s", "P53 gene and effects on the cancer cell cycle", "Chronic Kidney Disease and Wolf-Hirschhorn Syndrome", "Ryann is lazy and doesn’t wanna do research"],
        correct: "Chronic Kidney Disease and Wolf-Hirschhorn Syndrome"
    },
    {
        question: "How many times did Ryann apply to medical school?",
        choices: ["1", "2", "3", "4"],
        correct: "1"
    },
    {
        question: "What did Hannah make for Ryann’s intramural softball team?",
        choices: ["Cookies", "Cake Pops", "Jerseys", "Matching Socks", "Trail Mix"],
        correct: "Jerseys"
    },
    {
        question: "Proudest achievement in medical school?",
        choices: ["Passing Step 1 and Step 2", "GPA", "Number of Interviews", "Intubating a patient", "Submitting the residency application with 6 minutes to spare", "Merit Scholarship"],
        correct: "Submitting the residency application with 6 minutes to spare"
    },
    {
        question: "What was Ryann’s least favorite part of medical school?",
        choices: ["Written Exams", "Ethics Courses", "OSCE’s (Objective Structured Clinical Examinations)"],
        correct: "OSCE’s (Objective Structured Clinical Examinations)"
    },
    {
        question: "What group is Ryann the president of in Medical school?",
        choices: ["Med/Peds Interest Group", "Parents in Medical School", "Oncology Interest Group", "Curriculum Committee", "Pediatric Developmental Disabilities Interest Group"],
        correct: "Oncology Interest Group"
    },
    {
        question: "What color scrubs was Ryann’s medical school class?",
        choices: ["Blue", "Black", "Red", "Green", "Gray"],
        correct: "Green"
    },
    {
        question: "Where did Ryann match??",
        choices: ["Vanderbilt", "UT-Memphis", "SC-Greenville", "UAB", "Emory", "Kentucky", "Indiana", "Baylor"],
        correct: "Emory"
    }   
];
print(questions.length)

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
            userScore += 15; // Triple points for the bonus question
        } else {
            userScore += 5;
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
        
        if (index === BONUS_QUESTION_INDEX) {
            questionDiv.innerHTML = `<p><strong>Bonus Question:</strong> ${q.question}</p>`;
        } 
        else {
            questionDiv.innerHTML = `
                <p><strong>Question ${index + 1}${bonusText}:</strong> ${q.question}</p>
                <p><strong>Correct answer:</strong> ${q.correct}</p>
            `;
        }
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
            li.innerText = `${data.name}`;
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


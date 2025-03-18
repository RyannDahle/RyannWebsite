// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyACL2uv7OrlEi1aStBwpGAB0gMmlnQ0S9I",
    authDomain: "ryannwebsite.firebaseapp.com",
    projectId: "ryannwebsite",
    storageBucket: "ryannwebsite.firebasestorage.app",
    messagingSenderId: "789253952535",
    appId: "1:789253952535:web:e740b05f6473926af2f852",
    measurementId: "G-EN9P6J2DGN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function submitAnswer(answer) {
    let correctAnswer = "Paris";
    let userName = prompt("Enter your name:");

    if (!userName) return; // If user cancels prompt

    let score = answer === correctAnswer ? 10 : 0;
    
    // Save score to Firebase
    addDoc(collection(db, "scores"), {
        name: userName,
        score: score
    }).then(() => {
        console.log("Score saved!");
        loadLeaderboard();
    }).catch(error => console.error("Error saving score:", error));
}

// Expose functions to the global scope for HTML access
window.submitAnswer = submitAnswer;

// Fetch and display leaderboard
// Fetch and display leaderboard
function loadLeaderboard() {
    const leaderboard = document.getElementById("leaderboard");
    const q = query(collection(db, "scores"), orderBy("score", "desc"), limit(5));
    
    leaderboard.innerHTML = "";

    getDocs(q)
    .then(snapshot => {
        snapshot.forEach(doc => {
            let data = doc.data();
            let li = document.createElement("li");
            li.innerText = `${data.name}: ${data.score} points`;
            leaderboard.appendChild(li);
// Load leaderboard on page load
window.onload = loadLeaderboard;

// Expose functions to the global scope
window.loadLeaderboard = loadLeaderboard;ror("Error loading leaderboard:", error));
}
// Load leaderboard on page load
window.onload = loadLeaderboard;
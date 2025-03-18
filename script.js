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
    addDoc(collection(db, "scores"), {

    // Save score to Firebase
    db.collection("scores").add({
        name: userName,
        score: score
    }).then(() => {
        console.log("Score saved!");
        loadLeaderboard();
    }).catch(error => console.error("Error saving score:", error));
}

// Fetch and display leaderboard
function loadLeaderboard() {
    const q = query(collection(db, "scores"), orderBy("score", "desc"), limit(5));
    getDocs(q)
    leaderboard.innerHTML = "";

    db.collection("scores").orderBy("score", "desc").limit(5).get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            let data = doc.data();
            let li = document.createElement("li");
            li.innerText = `${data.name}: ${data.score} points`;
            leaderboard.appendChild(li);
        });
    });
}

// Load leaderboard on page load
window.onload = loadLeaderboard;
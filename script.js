// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function submitAnswer(answer) {
    let correctAnswer = "Paris";
    let userName = prompt("Enter your name:");

    if (!userName) return; // If user cancels prompt

    let score = answer === correctAnswer ? 10 : 0;
    document.getElementById("result").innerText = score > 0 ? "Correct!" : "Wrong!";

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
    let leaderboard = document.getElementById("leaderboard");
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
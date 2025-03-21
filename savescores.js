const admin = require('firebase-admin');
const fs = require('fs');

// Import your service account credentials
const serviceAccount = require('./ryannwebsite-firebase-adminsdk-fbsvc-5f15728ebc.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const scoresCollection = db.collection('scores');

// Function to save scores to a text file
async function saveScoresToFile() {
    try {
        const snapshot = await scoresCollection.get();
        if (snapshot.empty) {
            console.log("No scores found.");
            return;
        }

        // Retrieve and sort scores in descending order
        const scores = snapshot.docs
            .map(doc => doc.data())
            .sort((a, b) => b.score - a.score);

        const fileContent = scores.map(score => `${score.name}: ${score.score}`).join('\n');

        fs.writeFileSync('scores.txt', fileContent, 'utf8');
        console.log("Scores saved to scores.txt in descending order.");
    } catch (error) {
        console.error("Error saving scores:", error);
    }
}

// Run the function
saveScoresToFile();
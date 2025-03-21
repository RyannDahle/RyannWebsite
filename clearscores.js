const admin = require('firebase-admin');
const readline = require('readline');

// Import your service account credentials
const serviceAccount = require('./ryannwebsite-firebase-adminsdk-fbsvc-5f15728ebc.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const scoresCollection = db.collection('scores');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Are you sure you want to clear all scores? This action cannot be undone. (yes/no): ", async (answer) => {
    if (answer.toLowerCase() === 'yes') {
        try {
            const snapshot = await scoresCollection.get();
            if (snapshot.empty) {
                console.log("No scores found.");
            } else {
                const batch = db.batch();
                snapshot.docs.forEach(doc => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
                console.log(`Cleared names and scores for ${snapshot.size} documents.`);
            }
        } catch (error) {
            console.error("Error clearing scores: ", error);
        }
    } else {
        console.log("Operation canceled.");
    }
    rl.close();
});
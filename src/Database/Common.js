import fs from 'firebase-admin';
import { readFile } from 'fs/promises';
const serviceAccount = JSON.parse(await readFile(new URL('../Firebase/firebase_key.json', import.meta.url)));

// Connect to firebase
fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
});
const db = fs.firestore();

export const common = {
    db : db,
}

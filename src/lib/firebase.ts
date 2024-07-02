import admin from "firebase-admin";

const credentials = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: (process.env.FIREBASE_PRIVATE_KEY as string).replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

const app = admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

export const db = app.firestore();
export const auth = app.auth();
export const bucket = app.storage().bucket(process.env.FIREBASE_DEFAULT_STORAGE_BUCKET);

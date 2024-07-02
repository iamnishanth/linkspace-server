"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucket = exports.auth = exports.db = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const credentials = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};
const app = firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(credentials),
});
exports.db = app.firestore();
exports.auth = app.auth();
exports.bucket = app.storage().bucket(process.env.FIREBASE_DEFAULT_STORAGE_BUCKET);
//# sourceMappingURL=firebase.js.map
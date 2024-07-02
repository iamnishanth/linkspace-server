"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirebaseTimestamp = exports.browserHeaders = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
exports.browserHeaders = {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.5",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    DNT: "1",
    Referer: "https://www.google.com",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
};
const getFirebaseTimestamp = () => {
    return firebase_admin_1.default.firestore.FieldValue.serverTimestamp();
};
exports.getFirebaseTimestamp = getFirebaseTimestamp;
//# sourceMappingURL=network.js.map
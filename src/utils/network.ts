import admin from "firebase-admin";

export const browserHeaders = {
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

export const getFirebaseTimestamp = () => {
  return admin.firestore.FieldValue.serverTimestamp();
};

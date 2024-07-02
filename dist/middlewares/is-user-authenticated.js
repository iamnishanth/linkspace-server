"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserAuthenticated = void 0;
const firebase_1 = require("../lib/firebase");
const isUserAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    try {
        const decodedToken = yield firebase_1.auth.verifyIdToken(authorization);
        // @ts-expect-error
        req.user = decodedToken;
        next();
    }
    catch (error) {
        console.error("Error verifying auth token:", error);
        res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
});
exports.isUserAuthenticated = isUserAuthenticated;
//# sourceMappingURL=is-user-authenticated.js.map
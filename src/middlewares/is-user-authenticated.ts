import type { Request, Response, NextFunction } from "express";
import { auth } from "../lib/firebase";

export const isUserAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decodedToken = await auth.verifyIdToken(authorization);
    // @ts-expect-error
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying auth token:", error);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

import express from "express";
import { isUserAuthenticated } from "../middlewares/is-user-authenticated";
import { savePost } from "../controllers/post-controller";

const router = express.Router();

router.post("/save-post", isUserAuthenticated, savePost);

export default router;

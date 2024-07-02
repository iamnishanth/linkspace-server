import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import postRoutes from "./routes/post-routes";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const port = process.env.PORT || 8080;

app.get("/", (_req: Request, res: Response) => {
  return res.send("linkspace");
});

app.use("/api/post", postRoutes);

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});

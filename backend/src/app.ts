import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import type { Application, Request, Response } from "express";
import helmet from "helmet";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import routes from "./lib/routes.js";

const app: Application = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Server Running" });
});

app.use(notFound);
app.use(errorHandler);

export default app;

import express from "express";
import cors from "cors";
import morgan from "morgan";
import notFound from "./middlewares/notFound.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import { router } from "./routes/router.js";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import { envVariables } from "./config/envVariables.js";
import "../src/config/passport.js";
import passport from "passport";

const app = express();

app.use(
  expressSession({
    secret: envVariables.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  cors({
    origin: envVariables.CLIENT_URL,
    credentials: true,
  })
);

app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.status(200).json({ message: "HELLO FROM DESH NETA TARIQUE RAHMAN" });
});

app.use("/api/v1", router);

app.use(notFound);
app.use(globalErrorHandler);

export default app;

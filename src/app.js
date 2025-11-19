import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import passport from "passport";
import "../src/config/passport.js";
import compression from "compression";
import cookieParser from "cookie-parser";
import { router } from "./routes/router.js";
import expressSession from "express-session";
import notFound from "./middlewares/notFound.js";
import { limiter } from "./middlewares/rateLimiter.js";
import { envVariables } from "./config/envVariables.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";

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

// CORS configuration
const corsOptions = {
  origin: envVariables.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 600,
};

app.use(cors(corsOptions));
app.use(helmet());

app.use(
  cors({
    origin: envVariables.CLIENT_URL,
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(limiter);
app.use(compression());

app.get("/", (_req, res) => {
  res.status(200).json({ message: "HELLO FROM DESH NETA TARIQUE RAHMAN" });
});

app.use("/api/v1", router);

app.use(notFound);
app.use(globalErrorHandler);

export default app;

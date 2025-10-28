import express from "express";
import cors from "cors";
import morgan from "morgan";
import notFound from "./middlewares/notFound.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import { router } from "./routes/router.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.send("Hello FROM DESH_NETA TARIQUE RAHMAN");
});

app.use("/api/v1", router);

app.all("*", notFound);
app.use(globalErrorHandler);

export default app;

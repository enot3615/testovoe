import express from "express";
import router from "./routes/tasks.js";
import auth from "./routes/auth.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config()

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173' }));

app.use("/api/tasks", router);
app.use("/api", auth);

app.listen(3000, () => {
    console.log("Server started on port 3000");
})
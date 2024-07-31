import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import DBConnection from "./utils/connectDB.js";
const port = process.env.PORT || 3050;
import rootRouter from "./routes/rootRoute.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(bodyParser.json());

DBConnection();

app.use("/api/", rootRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

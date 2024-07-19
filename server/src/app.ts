import express, { Express } from "express";
import dotenv from "dotenv";
import connectDb from "./config/db";
import path from "path";
import bodyParser from "body-parser";
import errorHandler from "./middlewares/errorHandler";
import cors from "cors";

dotenv.config();

connectDb(); // database connection

const app: Express = express();

const PORT: string | number = process.env.PORT || 3000;

app.use(cors()); // allow cross-origin requests from any domain

app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads'))); // Serve static files from the uploads directory

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }));

// routes
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/blog", require("./routes/blogRoutes"));

app.use(errorHandler); // error handling

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
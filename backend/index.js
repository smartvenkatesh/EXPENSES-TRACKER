import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotEnv from "dotenv"

import router from "./routes/expensesRoute.js"

dotEnv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use("/expenses", router)

// mongoose.connect("mongodb+srv://venky:venky@123@cluster123.k4l0yzx.mongodb.net/expense")
//     .then(() => console.log("DB Connected"))
//     .catch((err) => console.log(`DB Not Connected:${err}`))

// mongoose.connect("mongodb+srv://venky:venky%40123@cluster123.k4l0yzx.mongodb.net/expense")
mongoose.connect("mongodb://localhost:27017/expenses")
    .then(() => console.log("DB Connected ✅"))
    .catch((err) => console.log("DB Not Connected:", err));

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
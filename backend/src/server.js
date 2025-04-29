import express from "express"
import cors from "cors"
import "dotenv/config"
import authRoutes from "./routes/auth.route.js"
import bookRoutes from "./routes/book.route.js"
import { connectDb } from "./lib/db.js";

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const PORT = process.env.PORT

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
    connectDb();
})
import express from "express"
import { errorMiddleware } from "./middlewares/errorMiddleware.js"
import "dotenv/config";
import connectDb from "./config/connectDb.js";
import { userRoutes } from "./routes/userRoutes.js";
import { productRoutes } from "./routes/productRoutes.js";
import { vendorRoutes } from "./routes/vendorRoutes.js";
import cookieParser from "cookie-parser"
import cartRoutes from "./routes/cartRoutes.js";
import { orderRoutes } from "./routes/orderRoutes.js";
import { adminRoutes } from "./routes/adminRoutes.js";
import cors from "cors"



// connect to database
await connectDb()

const PORT = process.env.PORT

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get('/', (req, res) => {
    res.send("Hello")
})

app.use('/users', userRoutes)
app.use("/products", productRoutes)
app.use('/vendors', vendorRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)
app.use('/admin', adminRoutes)



app.use(errorMiddleware)

app.listen(PORT, () => {
    console.log(`Server listening on Port ${PORT}`)
})
import express, { json, urlencoded } from 'express'
import { connectDB } from './config/db.js';
import recipeRouter from './routers/recipe.router.js'
import userRouter from './routers/user.router.js'
import categoryRouter from './routers/category.router.js'
import { errorHandler, urlNotFound } from './middlewares/errors.middleware.js';
import morgan from "morgan";
import {config} from 'dotenv'
import cors from 'cors';

config();

const app=express();
connectDB('recipesDB');
app.use(json());
app.use(urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(cors({origin: "http://localhost:5173"}));

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use("/uploads", express.static("public/uploads"));


app.use('/recipes', recipeRouter);
app.use('/users', userRouter);
app.use('/categories', categoryRouter);
app.get("/recipes/search", recipeRouter);


app.use(urlNotFound);
app.use(errorHandler);

const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening http://localhost:${port}`);
});
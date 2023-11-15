import express from 'express';
import authRoutes from './routes/authRoutes';
import bodyParser from 'body-parser';
import { connectToDb } from './utils/db';
import { log } from 'console';
const app = express();
import path = require('path');
// connect to db
connectToDb();
log("connected to db")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.get("/",(req,res)=>{
    res.send("hello world")
})
app.use("/auth",authRoutes)
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running... on port ${port}`));

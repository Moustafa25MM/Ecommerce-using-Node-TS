import express, { Express } from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import { indexRouter } from './routes';
import cookieParser from 'cookie-parser';
dotenv.config();
const mongoUrl = process.env.MONGO_URL as string;
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log(`DB connected`);
  })
  .catch(() => {
    console.log(`DB connection failed`);
  });

const app: Express = express();
app.use(express.json());
// app.use(cookieParser());
// app.use(express.static('src/uploadedImages'));
app.use(morgan('dev'));

app.use(indexRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`the server is running on port ${port}`);
});

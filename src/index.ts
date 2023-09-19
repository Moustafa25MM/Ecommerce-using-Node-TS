import express, { Express } from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import * as dotenv from 'dotenv';

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
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ msg: 'welcome to ecommerce world' });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`the server is running on port ${port}`);
});

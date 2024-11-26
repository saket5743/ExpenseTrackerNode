import express from 'express';
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import connectDB from './db/connect.db';
import expenseRouter from './router/expense.router';
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(bodyParser.json());

app.use('/api/v1/expenses', expenseRouter);

const start = async () => {
  await connectDB(process.env.DB_URL as string);
  console.log('DB Connected')
  app.listen(port, () => {
    console.log(`The server is listening on port ${port}.`)
  })
}

start()
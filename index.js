import mysql from 'mysql2';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


const port = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE
});

db.connect((err) => {
  if (err) {
    console.error('Connection failed', err)
    return;
  }
  console.log('Connected to database')
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});
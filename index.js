import mysql from 'mysql2';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';


const port = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

//Database connection
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

//Create database table userP
/*const sql = `CREATE TABLE IF NOT EXISTS userP (user_id INT PRIMARY KEY AUTO_INCREMENT, first_name VARCHAR(255), last_name VARCHAR(255), phone_number VARCHAR(15), email VARCHAR(255), password VARCHAR(255))`;

db.query(sql, (err, result) =>{
  if (err) {
    console.error('Error creating table', err)
    return;
  }
  console.log('Table created successfully')
});*/

//Create table userB
const sql = `CREATE TABLE IF NOT EXISTS userB (userB_id INT PRIMARY KEY AUTO_INCREMENT, b_name VARCHAR(255), b_phone_number VARCHAR(15), b_email VARCHAR(255), b_password VARCHAR(255), b_location VARCHAR(255))`;

db.query(sql, (err, result) =>{
  if (err) {
    console.error('Error creating table', err)
    return;
  }
  console.log('Table created successfully')
});

//Route to register user
app.post('/register', async (req, res) => {
  const { first_name, last_name, phone_number, email, password } = req.body;
 
   db.query(`SELECT * FROM userP WHERE email = ?`, [email], async (err, result) => {
     if (err) {
       console.error('Error checking user', err);
   return res.status(500).json({ message: 'Error checking user' });
     }
     if (result.length > 0) {
       return res.status(400).json({message: "User already exists"})
     }

     try {
     const hashedPassword = await bcrypt.hash(password, 10);
     
     const sql = `INSERT INTO userP (first_name, last_name, phone_number, email, password) VALUES (?, ?, ?, ?, ?);`;

     db.query(sql, [first_name, last_name, phone_number, email, hashedPassword], (err, result) => {
       if (err) {
         console.error('Error registering user', err);
         return res.status(401).json({message: 'Error inserting user'})
       }
       return res.status(200).json({message: 'User registered successfully'})
     });
       }catch (hashError) {
      console.error('Error hashing password', hashError);
      return res.status(500).json({ message: 'Error processing request' });
     }
   });
});

//port connection
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});
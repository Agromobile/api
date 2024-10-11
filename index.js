import mysql from 'mysql2';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken'


const port = process.env.PORT || 3001;

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
dotenv.config();
app.use(cookieParser());

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
/*const sql = `CREATE TABLE IF NOT EXISTS userB (userB_id INT PRIMARY KEY AUTO_INCREMENT, b_name VARCHAR(255), b_phone_number VARCHAR(15), b_email VARCHAR(255), b_password VARCHAR(255), b_location VARCHAR(255))`;

db.query(sql, (err, result) =>{
  if (err) {
    console.error('Error creating table', err)
    return;
  }
  console.log('Table created successfully')
});*/

//create product table
const sql = `CREATE TABLE IF NOT EXISTS products (id INT PRIMARY KEY AUTO_INCREMENT, userP_id INT, product_image VARCHAR(255), product_name VARCHAR(255), product_discount_price DECIMAL(10, 2), product_price DECIMAL(10, 2), FOREIGN KEY (userP_id) REFERENCES userP(user_id))`;

db.query(sql, (err, result) => {
  if (err) {
    console.log('Failed to create table', err);
  }
  console.log('Products table created successfully');
});

//Register and input data into userB table
app.post('/register/business', async (req, res) => {
  const { b_name, b_phone_number, b_email, b_password, b_location } = req.body;
  db.query(`SELECT * FROM userB WHERE b_email = ?`, [b_email], async (err, result) => {
    if (err) {
      console.error('Error checking user', err);
      return res.status(500).json({ message: 'Error checking user' });
    }
    if (result.length > 0) {
      return res.status(400).json({message: "User already exists"})
    }

    try {
      const hashedPassword = await bcrypt.hash(b_password, 10);
      const sql = `INSERT INTO userB (b_name, b_phone_number, b_email, b_password, b_location) VALUES (?, ?, ?, ?, ?)`;
      
      db.query(sql, [b_name, b_phone_number, b_email, hashedPassword, b_location], (err, result) => {
        if (err) {
          console.error('Error registering user', err);
          return res.status(401).json({message: 'Error inserting user'})
        }
        return res.status(200).json({message: 'User registered successfully'})
      })
    } catch (hashError) {
      console.error('Error hashing password', hashError);
      return res.status(500).json({ message: 'Error processing request' });
     }
  });
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

//User loggin
app.post('/login/business', (req, res) => {
  const { b_email, b_password } = req.body;

  db.query('SELECT * FROM userB WHERE b_email = ?', [b_email], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = results[0];
    const passwordIsValid = bcrypt.compareSync(b_password, user.b_password);

    if (!passwordIsValid) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.userB_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
   
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    //res.status(200).json({ token });

    res.json({message: 'login successful'});
  });
});

//Personal user login
app.post('/login/personal', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM userP WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = results[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });


    res.json({message: 'login successful'});
  });
});

//Middleware to protect routes
const authenticateToken = (req, res, next) => {

  const token = req.cookies.token;
  if (!token) 
    {
      return res.status(401).json({message: 'unauthorized'});
    }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({message: 'invalid token'});
    }
    req.user = user;
    next();
  });
};

//Logout route
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({message: 'logout successfully'});
  console.log('logged out');
})

//port connection
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});

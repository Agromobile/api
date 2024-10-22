# Full-Stack Application for User Registration, Authentication, and Product Management
## 📋 Overview
This is a full-stack web application built with Node.js, Express.js, and MySQL that allows users (both personal and business) to register, log in, and manage products securely. It includes features like user authentication, session handling with JWT, password hashing with bcrypt, and protected routes to ensure security. Additionally, it provides CRUD operations for managing products.

## 🛠️ Tech Stack
Backend: Node.js, Express.js
Database: MySQL (mysql2)
Security: bcrypt, JWT
Other: dotenv, cookie-parser, cors

## 🌟 Features
User Registration:
Personal user registration
Business user registration
User Authentication:
Login and JWT-based session management
Password hashing with bcrypt
Product Management:
Add, edit, and delete products
Fetch products by category
Protected routes for CRUD operations
Admin Protection:
Admin-specific routes
Middleware to protect admin pages
Security Features:
Secure user sessions
HTTP-only cookies
Token-based authentication

## ⚙️ Installation
Prerequisites:
Node.js
MySQL

**Steps:**
Clone the repository:
git clone https://github.com/AgroMobile.git
Navigate to the project directory:
cd api

**Install dependencies:**
npm install
Set up a .env file in the root directory:
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASS=your_db_password
DB_DATABASE=your_db_name
JWT_SECRET=your_jwt_secret
NODE_ENV=development

Set up MySQL Database:
Create a MySQL database.
Update the .env file with your database credentials.
Run the SQL commands to create necessary tables in your database, or uncomment the table creation code in the index.js file to automatically create tables.

**Start the server:**
npm start
The server will run on http://localhost:3001.

## 🧩 API Endpoints
Authentication Routes
Register Personal User:
-POST /register
Example body:

json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "1234567890",
  "email": "john@example.com",
  "password": "yourpassword"
}

Register Business User:
POST /register/business
Example body:

json
{
  "b_name": "BusinessName",
  "b_phone_number": "1234567890",
  "b_email": "business@example.com",
  "b_password": "yourpassword",
  "b_location": "City"
}

Login Personal User:
POST /login/personal

Login Business User:
POST /login/business

Product Routes (Protected)
Create Product:
POST /create/product

Example body:

json
{
  "product_image": "image_url",
  "product_name": "Product Name",
  "product_discount_price": 99.99,
  "product_price": 120.00
}

Fetch All Products:
GET /products

Fetch Products by Category:
GET /:category

## 🔐 Security Features
Passwords are hashed using bcrypt before storing in the database.
User sessions are managed securely with JWT.
Protected routes ensure that only authenticated users can access specific features.
Cookies are marked as httpOnly for added security.

## 🏗️ Project Structure
bash
.
├── node_modules
├── .env               # Environment variables
├── package.json       # Project metadata and dependencies
├── index.js           # Main server file
└── README.md          # Project documentation

## 🤝 Contributing
Contributions are welcome! Feel free to submit a pull request or open an issue.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

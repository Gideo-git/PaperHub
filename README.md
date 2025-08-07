PaperHub - A Full-Stack Question Paper Archive
A web application designed for students to easily search, access, and download past university question papers. This project features a secure RESTful API backend and a dynamic, responsive frontend.

Live Site: https://paper-hub-xi.vercel.app/login.html

Features
User Authentication: Secure user registration and login system using JSON Web Tokens (JWT).

Role-Based Access Control: Two distinct user roles:

User: Can search, filter, and download papers.

Admin: Has all user privileges, plus the ability to upload new papers.

Dynamic Search: Filter papers by semester, subject, exam type, and year.

Cascading Dropdowns: The "Subject" dropdown dynamically updates based on the selected semester.

Secure File Handling: Admins can upload PDF papers, which are stored securely in a MongoDB database.

Protected Downloads: Only authenticated users can download papers.

Separate Admin/User Views: The UI conditionally renders different navigation and page options based on the user's role.

Tech Stack
Backend
Runtime: Node.js

Framework: Express.js

Database: MongoDB with Mongoose ODM

Authentication: JSON Web Tokens (JWT) & bcrypt for password hashing

File Uploads: Multer for handling multipart/form-data

Frontend
Core: HTML5, CSS3, Vanilla JavaScript (ES Modules)

Deployment:

Frontend: Vercel

Backend & Database: Render

Local Development
To run this project on your local machine, follow these steps.

Prerequisites
Node.js and npm installed

MongoDB installed locally or a connection string from a cloud provider (like MongoDB Atlas)

1. Clone the Repository
git clone https://github.com/Gideo-git/PaperHub.git
cd PaperHub

2. Install Backend Dependencies
Navigate to the backend directory and install the required npm packages.

cd Backend
npm install

3. Set Up Environment Variables
Create a file named .env in the Backend directory and add the following variables:

# The port your server will run on
PORT=5000

# Your MongoDB connection string
MONGO_URI=mongodb://localhost:27017/paperhub

# A secret key for signing JWTs (can be any random string)
JWT_SECRET=your_jwt_secret_key

4. Run the Backend Server
npm start

The backend server will be running at http://localhost:5000.

5. Run the Frontend
The frontend is a static site. The easiest way to run it and avoid CORS issues is with a live server extension.

Using VS Code: Install the Live Server extension. Right-click on login.html in the Frontend directory and select "Open with Live Server".

Deployment
This project is deployed using a modern CI/CD workflow:

The frontend is hosted on Vercel, connected to the deployment branch of the GitHub repository.

The backend Node.js server and MongoDB database are hosted on Render, also connected to the deployment branch.

Pushes to the deployment branch automatically trigger new deployments on both platforms.
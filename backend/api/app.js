const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../db/userModel");
const app = express();
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const auth = require("./auth");

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Curb CORS Errors by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.STORE);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Test endpoint to confirm server is working
app.get("/", (request, response) => {
  response.json({ message: "Hey! This is your server response!" });
});

// Require database connection and execute it
const dbConnect = require("../db/dbConnect");
dbConnect();

// Register endpoint
app.post("/api/register", (request, response) => {
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
      });

      user
        .save()
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        .catch((error) => {
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});

// Login endpoint
app.post("/api/login", (request, response) => {
  User.findOne({ email: request.body.email })
    .then((user) => {
      if (!user) {
        return response.status(404).send({
          message: "Email not found",
        });
      }

      bcrypt
        .compare(request.body.password, user.password)
        .then((passwordCheck) => {
          if (!passwordCheck) {
            return response.status(400).send({
              message: "Passwords do not match",
            });
          }

          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
              role: user.role,
            },
            process.env.JWT_SECRET , // Use a more secure secret
            { expiresIn: "24h" }
          );

          response.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
          });
        })
        .catch((error) => {
          response.status(500).send({
            message: "Error comparing passwords",
            error,
          });
        });
    })
    .catch((e) => {
      response.status(500).send({
        message: "Error finding user",
        e,
      });
    });
});

// Free endpoint
app.get("/api/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// Authentication endpoint
app.get("/api/auth-endpoint", auth, (request, response) => {
  // response.json({ message: "You are authorized to access me" });
  const userRole = request.user.role;
  response.json({ message: "You are authorized to access me" ,
    role: userRole });
});

app.put("/api/role", auth, async (request, response) => {
  const userRole = request.user.role;

  // Check if the authenticated user is an admin
  if (userRole !== "admin") {
    return response.status(403).json({ message: "You are not authorized to change roles." });
  }

  const { email, role } = request.body; // Get the email and new role from the request body

  // Validate input
  if (!email || !role) {
    return response.status(400).json({ message: "Email and new role are required." });
  }

  // Load valid roles from the environment variable
  const validRoles = process.env.VALID_ROLES.split(',');

  // Check if the newRole is one of the allowed roles
  if (!validRoles.includes(role)) {
    return response.status(400).json({ message: `Role must be one of the following: ${validRoles.join(', ')}` });
  }

  try {
    // Update the user's role in the database
    const updatedUser = await User.findOneAndUpdate(
      { email }, // Find user by email
      { role: role }, // Update role
      { new: true } // Return the updated user
    );

    if (!updatedUser) {
      return response.status(404).json({ message: "User not found." });
    }

    response.json({ 
      message: "User role updated successfully.", 
      user: updatedUser 
    });
  } catch (error) {
    response.status(500).json({ message: "Error updating user role.", error });
  }
});

// Get All Users Endpoint
app.get("/api/users", auth, async (request, response) => {
  const userRole = request.user.role;

  // Check if the authenticated user is an admin
  if (userRole !== "admin") {
    return response.status(403).json({ message: "You are not authorized to view users." });
  }

  try {
    // Retrieve all users from the database
    const users = await User.find().select("-password"); // Exclude password for security

    response.json({
      message: "Users retrieved successfully.",
      users,
    });
  } catch (error) {
    response.status(500).json({ message: "Error retrieving users.", error });
  }
});

module.exports = app;

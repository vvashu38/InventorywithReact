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
  res.setHeader("Access-Control-Allow-Origin", "*");
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
app.post("/register", (request, response) => {
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
app.post("/login", (request, response) => {
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
            },
            process.env.JWT_SECRET || "RANDOM-TOKEN", // Use a more secure secret
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
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// Authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});

module.exports = app;

const express = require("express");
const bcrypt = require("bcrypt");
// const User = require("../../db/userModel");
const User = require("../../db/models/userModel");
const jwt = require("jsonwebtoken");
const router = express();

// Login endpoint
router.post("/login", (request, response) => {
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

module.exports = router;
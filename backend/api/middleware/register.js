const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../../db/models/userModel");
const router = express();

router.post("/register", async (request, response) => {
    // const email = request.body.email;
    // const userIsPending = await User.findOne(
    //   { email }
    // );
    is_registered = true;
    bcrypt
      .hash(request.body.password, 10)
      .then((hashedPassword) => {
        const user = new User({
          email,
          password: hashedPassword,
          name: {
            first: request.body.name.first || '', // Assign empty string if not provided
            last: request.body.name.last || '',   // Assign empty string if not provided
          },
          is_registered,
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

module.exports = router;
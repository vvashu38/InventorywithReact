const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../../db/models/userModel");
const Group = require("../../db/models/groupModel");
const Transaction = require("../../db/models/transactionModel");
const router = express();

router.post("/test", async (request, response) => {
    const email = request.body.email;
    const existingUser = await User.findOne({ email });
    const userIsPending = await User.findOne(
      { email, is_registered : false }
    );
    const dummyGroup = new Group({
        name: 'Dummy Group',
        members: [], // You can leave it empty
        createdby: null,
        transactions: [] // Empty array, just for example
      });
      dummyGroup.save();

    if (existingUser && existingUser.is_registered) {
        // If user is already registered, return a message
        return response.status(400).send({
          message: "User is already registered",
        });
    }

    bcrypt.hash(request.body.password, 10).then(async (hashedPassword) => {
        const enableUser = await User.findOneAndUpdate({ email, is_registered : false },{
        password: hashedPassword,
        name: {
            first: request.body.name.first || '', // Assign empty string if not provided
            last: request.body.name.last || '',   // Assign empty string if not provided
        },
        is_registered : true,
        }
    ,{new: true, upsert:true}).then((result) => {
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
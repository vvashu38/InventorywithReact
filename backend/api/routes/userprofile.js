const express = require("express");
const User = require("../../db/models/userModel");
const router = express();
const auth = require("../middleware/auth");

router.get("/user", auth, async (request, response) => {
    const email = request.user.email;
  
    try {
      // Retrieve all users from the database
      const user = await User.findOne({email}).select("-password"); // Exclude password for security
  
      response.json({
        message: "Users retrieved successfully.",
        user,
      });
    } catch (error) {
      response.status(500).json({ message: "Error retrieving users.", error });
    }
  });

module.exports = router;
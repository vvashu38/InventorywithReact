const express = require("express");
const User = require("../../db/models/userModel");
const router = express();
const auth = require("../middleware/auth");

router.get("/users", auth, async (request, response) => {
    const userRole = request.user.role;
  
    try {
      // Retrieve all users from the database
      let users; // Declare users outside the if-else blocks
      if (userRole === "admin") {
          users = await User.find().select("-password");
      } else {
          users = await User.find({ role: { $ne: "admin" } }).select("-password");
      }

      response.json({
          message: "Users retrieved successfully.",
          users,
      });
    } catch (error) {
      response.status(500).json({ message: "Error retrieving users.", error });
    }
  });

module.exports = router;
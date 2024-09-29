const express = require("express");
const User = require("../../db/models/userModel");
const router = express();
const auth = require("../middleware/auth");

router.get("/users", auth, async (request, response) => {
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

module.exports = router;
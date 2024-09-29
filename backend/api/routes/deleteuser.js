const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../../db/models/userModel");
const router = express();
const auth = require("../middleware/auth");

router.delete("/deleteuser", auth, async (request, response) => {
    const userRole = request.user.role;
  
    // Check if the authenticated user is an admin
    if (userRole !== "admin") {
      return response.status(403).json({ message: "You are not authorized to delete users." });
    }
  
    const { email } = request.body; // Get the email and new role from the request body
  
    // Validate input
    if (!email) {
      return response.status(400).json({ message: "Email is required." });
    }
  
    try {
      // Update the user's role in the database
      const deleteUser = await User.findOneAndDelete(
        { email }
      );
  
      if (!deleteUser) {
        return response.status(404).json({ message: "User not found." });
      }
  
      response.json({ 
        message: "User deleted successfully.", 
        user: deleteUser 
      });
    } catch (error) {
      response.status(500).json({ message: "Error deleting user.", error });
    }
  });

module.exports = router;
const express = require("express");
const User = require("../../db/models/userModel");
const router = express();
const auth = require("../middleware/auth");

router.put("/role", auth, async (request, response) => {
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

module.exports = router;
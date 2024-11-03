const express = require("express");
const mongoose = require('mongoose');
const User = require("../../db/models/userModel");
const Group = require("../../db/models/groupModel");
const router = express();
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");

// Utility function to generate a random password
function generateRandomPassword(length = 12) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

// PUT route to update group members
router.put("/group/:id", auth, async (request, response) => {
    const _id = request.params.id;
    const userID = request.user.id;
    const emails = request.body.emails || [];

    if (!emails.length) {
        return response.status(400).json({ message: 'Email list is required.' });
    }

    try {
        // Find the group and ensure the current user is part of the group
        const group = await Group.findOne({
            $and: [
              { _id },                      // Check if the group exists
              { members: userID }           // Check if the user is in the members list
            ]
        }).populate('members', 'email name').populate('createdby', 'email name');

        if (!group) {
            return response.status(404).json({ message: "Group not found or user is not authorized." });
        }

        // Array to hold promises for creating users if they don't exist
        const userPromises = emails.map(async (email) => {
            let user = await User.findOne({ email });
            if (!user) {
                // Generate a random password for new users
                const defaultPassword = generateRandomPassword();
                const hashedPassword = await bcrypt.hash(defaultPassword, 10);
                user = new User({
                    email,
                    password: hashedPassword // Store the hashed password
                });
                await user.save();

                // You may want to send the generated password to the user via email or log it
                console.log(`Created new user: ${email}, Password: ${defaultPassword}`);
            }
            return user._id; // Return the ID of the existing or newly created user
        });

        // Resolve all promises to get user IDs
        const userIds = await Promise.all(userPromises);
        // Add users to the group if they are not already members
        userIds.forEach((userId) => {
            // Check if the user's _id is already present in the group's members array
            const userExists = group.members.some((member) => member._id.equals(userId));
            
            // If the user is not a member, add them
            if (!userExists) {
                console.log(userId);
                group.members.push(userId);
            }
        });        

        // Save the updated group
        await group.save();

        return response.status(200).json({
            message: 'Group updated successfully',
            group
        });

    } catch (error) {
        console.error(error.message);
        return response.status(500).json({ message: "Error updating group.", error: error.message });
    }
});

module.exports = router;

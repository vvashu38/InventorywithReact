const express = require("express");
const User = require("../../db/models/userModel");
const Group = require("../../db/models/groupModel");
const router = express();
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");

function generateRandomPassword(length = 12) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

router.post("/group", auth, async (request, response) => {
    const email = request.user.email;
    const name = request.body.groupName;
    const emails = request.body.emails || [];
    emails.push(email);
    if (!name || !emails.length) {
        return response.status(400).json({ message: 'Invalid payload. Group name and emails are required.' });
    }

    try {
        const creator = await User.findOne({ email });
        if (!creator) {
            return response.status(400).json({ message: 'Creator not found' });
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

                // You may want to send the generated password to the user via email or response
                console.log(`Created new user: ${email}, Password: ${defaultPassword}`);
            }
            return user._id; // Return the ID of the existing or newly created user
        });

        // Resolve all promises to get member IDs
        const usersIds = await Promise.all(userPromises);
        const newGroup = new Group({name, createdby: creator._id, members: usersIds});
        newGroup.save();

        return response.status(201).json({
            message: 'Group created successfully',
            group: newGroup,
        });
        
    } catch (error) {
      response.status(500).json({ message: "Error retrieving group.", error : error.message });
    }
});

module.exports = router;
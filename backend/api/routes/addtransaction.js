const express = require("express");
const router = express.Router(); // Use express.Router() instead of express()
const auth = require("../middleware/auth");
const User = require("../../db/models/userModel");
const Group = require("../../db/models/groupModel");
const Transaction = require("../../db/models/transactionModel");

router.post("/transaction", auth, async (req, res) => {
    try {
        const spender = req.user.id; // Get spender ID from authenticated user
        // Destructure transaction details from request body
        const { group, amount, description, splits } = req.body;

        // Check if required fields are present
        if (!group || !amount || !description || !splits || !Array.isArray(splits)) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Resolve user emails to user IDs
        const resolvedSplits = await Promise.all(
            splits.map(async (split) => {
                const user = await User.findOne({ email: split.paid_for });
                if (!user) {
                    throw new Error(`User with email ${split.paid_for} not found`);
                }
                return {
                    paid_for: user._id,
                    amount: split.amount
                };
            })
        );

        let splitsResolved = resolvedSplits;
        const totalAmount = splitsResolved.reduce((total, split) => {
            return total += split.amount;
        }, 0);

        if(amount != totalAmount){
            return res.status(400).json({
                message: 'Amount spent is not equal to amount sent',
                total : totalAmount
            });
        }

        // Create a new transaction
        const transaction = new Transaction({
            group,
            spender,
            amount,
            description,
            date: Date.now(),
            splits : splitsResolved
        });

        // Save the transaction
        const savedTransaction = await transaction.save();

        // Update the group to include the new transaction
        await Group.findByIdAndUpdate(group, {
            $push: { transactions: savedTransaction._id } // Add transaction ID to group's transactions array
        });

        return res.status(201).json({
            message: 'Transaction added to the group',
            transaction: savedTransaction, // Changed from 'group' to 'transaction' for clarity
        });
        
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "Error adding transaction.", error: error.message });
    }
});

module.exports = router;

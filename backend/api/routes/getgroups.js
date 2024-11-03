const express = require("express");
const Group = require("../../db/models/groupModel");
const router = express();
const auth = require("../middleware/auth");
const User = require("../../db/models/userModel");

router.get("/groups", auth, async (request, response) => {
    const userId = request.user.id;
    try {
        // const group = await Group.find({
        //     $or: [
        //       { createdby: userId },        // Check if user is the creator
        //       { members: userId }           // Check if user is in the members list
        //     ]
        //   }).populate('members','email name').populate('createdby','email name').populate('transactions', 'spender splits');

        const group = await Group.find({
          $or: [
            { createdby: userId },        // Check if user is the creator
            { members: userId }           // Check if user is in the members list
          ]
        })
        .populate('members', 'email name')                  // Populate member details
        .populate('createdby', 'email name')                // Populate creator details
        .populate({
          path: 'transactions',
          populate: [
            { path: 'spender', select: 'email name' },      // Populate spender details
            { path: 'splits.paid_for', select: 'email name' } // Populate paid_for details in splits
          ]
        });

          
        if (!group) {
            return response.status(404).json({ message: "Group not found" });
        }
        
        return response.status(200).json({
            message: 'Group found successfully',
            group: group,
        });
        
    } catch (error) {
      response.status(500).json({ message: "Error retrieving group.", error : error.message });
    }
});

module.exports = router;
const express = require("express");
const Group = require("../../db/models/groupModel");
const router = express();
const auth = require("../middleware/auth");

router.get("/groups", auth, async (request, response) => {
    const userId = request.user.id;
    try {
        const group = await Group.find({
            $or: [
              { createdby: userId },        // Check if user is the creator
              { members: userId }           // Check if user is in the members list
            ]
          }).populate('members','email name').populate('createdby','email name');
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
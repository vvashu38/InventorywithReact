const express = require("express");
const Group = require("../../db/models/groupModel");
const router = express();
const auth = require("../middleware/auth");

router.get("/groups", auth, async (request, response) => {
    const userId = request.user.id;
    try {
        const group = await Group.find({ createdby : userId }).populate('members','email name').populate('createdby','email name');
        if (!group) {
            return response.status(404).json({ message: "Group not found" });
        }
        
        return response.status(201).json({
            message: 'Group found successfully',
            group: group,
        });
        
    } catch (error) {
      response.status(500).json({ message: "Error retrieving group.", error : error.message });
    }
});

module.exports = router;
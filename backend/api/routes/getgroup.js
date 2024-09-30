const express = require("express");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Group = require("../../db/models/groupModel");
const router = express();
const auth = require("../middleware/auth");

router.get("/group/:id", auth, async (request, response) => {
    const _id = request.params.id;
    const userId = ObjectId.createFromHexString(request.user.id);
    try {
        const group = await Group.findOne({ _id }).populate('members','email name').populate('createdby','email name');
        if (!group) {
            return response.status(404).json({ message: "Group not found" });
        }
        const userExists = group.members.some(memberId => memberId.equals(userId));
        if(userExists || request.user.role == "admin"){
            return response.status(201).json({
                message: 'Group found successfully',
                group: group,
            });
        }else{
            return response.status(400).json({
                message: 'You don\'t have necessary permission to get the group'
            });
        }
    } catch (error) {
      response.status(500).json({ message: "Error retrieving group.", error : error.message });
    }
});

module.exports = router;
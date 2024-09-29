const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true},
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' , required: true }],
    createdby: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'transaction' }]
},
{ timestamps: true } 
);
  
// Export the model, preventing overwrite issues
module.exports = mongoose.models.group || mongoose.model("group", GroupSchema);

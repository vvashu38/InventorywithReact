const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'group' },
    spender: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    amount: Number,
    description: String,
    date: { type: Date, default: Date.now },
    splits: [{
      paid_for: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
      amount: Number
    }]
  },{ timestamps: true });
  
// Export the model, preventing overwrite issues
module.exports = mongoose.models.transaction || mongoose.model("transaction", TransactionSchema);

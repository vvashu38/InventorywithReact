const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide an Email!"],
      unique: [true, "Email Exist"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password!"],
    },
    name: {
      first: { type: String }, // Not required
      last: { type: String },  // Not required
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property for full name
UserSchema.virtual("fullName")
  .get(function () {
    return `${this.name.first || ''} ${this.name.last || ''}`.trim();
  })
  .set(function (v) {
    this.name.first = v.substr(0, v.indexOf(" "));
    this.name.last = v.substr(v.indexOf(" ") + 1);
  });

// Export the model, preventing overwrite issues
module.exports = mongoose.models.Users || mongoose.model("Users", UserSchema);

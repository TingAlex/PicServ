const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  userName: String,
  email: String,
  password: String,
  spaceUsed: { type: Number, default: 0 },
  spaceLimit: { type: Number, default: 100 },
  pics: [
    {
      title: String,
      size: { type: Number, default: 0 },
      ref: { type: Boolean, default: false }
    }
  ]
});

mongoose.model("users", userSchema);

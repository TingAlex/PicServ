const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  userName: String,
  email: String,
  password: String,
  spaceUsed: { type: Number, default: 0 },
  spaceLimit: { type: Number, default: 100 },
  articles: [
    {
      articleId: String,
      pics: [
        {
          title: String,
          picId: String
        }
      ]
    }
  ]
});

mongoose.model("users", userSchema);

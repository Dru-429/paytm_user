const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, () => {
  console.log("Database connected");
});

const userSchema = new  mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true,
    minLength: 3,
    maxLength: 30,
  },
  firstname: {
    type: String,
    require: true,
  },
  lastname: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
    minLength: 6,
  }
});

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    require: true
  },
  balance: {
    type: Number,
    require: true,
  }
})

const Users = mongoose.model("Users",userSchema);
const Accounts = mongoose.model("Accounts", accountSchema)

module.exports = {
  Users,
  Accounts,
}
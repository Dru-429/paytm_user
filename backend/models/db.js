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

const Users = mongoose.model("users",userSchema);

module.exports = {
  Users,
}
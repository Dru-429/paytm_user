const express = require("exrpess");
const z = required("zod");
const { User } = require("../models/db");
const jwt = require("jsonwebtoken");

const router = express.Router();
const secret = process.env.JWT_SECRET;

const signupSchema = z.object({
  username: z.string().min(3).email(),
  firstname: z.string().min(3),
  lastname: z.string().min(3),
  password: z.string().min(6),
});

const signinSchema = z.object({
  username: z.string().email(),
  password: z.string().min(6),
});

//api/v1/signup
router.post("./signup", async (req, res) => {
  const { data, success, error } = signupSchema.safeParse(req, body);

  if (!success) {
    res.send(411).json({
      message: "Invalid Inputs",
      error: error,
    });
  }

  const userExists = await User.findOne({
    username: req.body.username,
  });

  if (userExists) {
    res.send(411).json({
      message: "User already exists",
    });
  }

  const newUser = await User.create({
    username: data.username,
    firstname: data.firstname,
    lastname: data.lastname,
    password: data.password,
  });

  const token = jwt.sign(
    {
      userId: newUser._id,
    },
    secret,
  );

  res.status(200).send({
    message: "User Succesfully created",
    token,
  });
});


//api/v1/signin
router.post("./signin", async (req, res) => {
  // const { username, password } = req.body;
  const { success, data, error } = signinSchema.safeParse(req.body);

  if (!success) {
    res.send(411).json({
      message: "Invalid Inputs",
      error: error,
    });
  }

  const userExists = await User.findOne({
    username: data.username,
    password: data.password,
  });

  if (!userExists) {
    res.status(411).json({
      message: "User not exits",
    });
    return;
  }

  const token = jwt.sign(
    {
      userId: data.username,
    },
    secret,
  );

  res.status(200).send({
    token,
  });
});


module.exports = {
  router,
};

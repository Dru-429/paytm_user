const express = require("express");
const z = require("zod");
const { User } = require("../models/db");
const jwt = require("jsonwebtoken");
const { authmiddleware } = require("../middleware");

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

const updateSchema = z.object({
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  password: z.string().optional(),
});

//api/v1/signup
router.post("/signup", async (req, res) => {
  const { data, success, error } = signupSchema.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Invalid Inputs",
      error: error,
    });
  }

  const userExists = await User.findOne({
    username: req.body.username,
  });

  if (userExists) {
    return res.status(411).json({
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
    message: "User Successfully created",
    token,
  });
});

//api/v1/signin
router.post("/signin", async (req, res) => {
  const { success, data, error } = signinSchema.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Invalid Inputs",
      error: error,
    });
  }

  const userExists = await User.findOne({
    username: data.username,
    password: data.password,
  });

  if (!userExists) {
    return res.status(411).json({
      message: "User not exists",
    });
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

//Update user data route
//api/v1/user/
router.put("/", authmiddleware, async (req, res) => {
  const { userId } = req;
  const { success, data, error } = updateSchema.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Invalid Inputs",
      error: error,
    });
  }

  await User.updateOne(
    {
      _id: userId,
    },
    {
      firstname: data.firstname,
      lastname: data.lastname,
      password: data.password,
    },
  );

  res.status(200).json({
    message: "User Updated",
  });
});

//Search route
//api/v1/user/bulk/?filter=harkirat
router.get("/bulk", async (req, res) => {
  const search = req.query.filter || "";

  const users = await User.find({
    $or: [
      { firstname: { $regex: search, $options: "i" } },
      { lastname: { $regex: search, $options: "i" } },
    ],
  });

  //If we send users, directly then it will also send password to the forntend, 
  //so we mapped it and only sned the req. query 
  res.status(200).json({
    users: users.map((user) => ({
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      _id: user._id,
    })),
  });
});

router

module.exports = {
  router,
};

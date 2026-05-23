const express = require('express');
const userRouter = require('./user')
const accountRouter = require("./accounts")

const router1 = express.Router();
router1.use('/user', userRouter);
router1.use('/account',accountRouter);

module.exports = {
  router1
}
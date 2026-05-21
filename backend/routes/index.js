const express = require('express');
const userRouter = require('./user')

const router1 = express.Router();
router1.use('/user', userRouter);;

module.exports = {
  router1
}

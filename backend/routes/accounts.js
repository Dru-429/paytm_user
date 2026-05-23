const express = require("express");
const authmiddleware = require("../middelware");
const { Accounts, Users } = require("../models/db");
const { default: mongoose } = require("mongoose");

const router = express.Router();
router.use(express.json());

//accounts/balance
router.get("/balance", authmiddleware, async (req, res) => {
  const { userId } = parseInt(req.body);

  const balanceAccount = await Accounts.findById(userId);
  const balance = balanceAccount.balance;

  res.status(200).send({
    balance,
  });
});

//accounts/transfer
router.put("/transfer", authmiddleware, async (req, res) => {
  const { to, amount } = req.body;
  const userId = parseInt(req.body);

  const session = await mongoose.startSessionession();

  const sender = await Accounts.findById(userId).session(session);

  if (sender.balance < amount) {
    await session.endSession();
    return res.status(400).json({
      message: "Insaficent Balance ",
    });
  }

  const reciver = await Users.findOne({
    _id: to,
  }).session(session);

  if (!reciver) {
    await session.endSession();
    return res.status(400).json({
      message: "Reciver not found",
    });
  }

  //performing transaction
  await Accounts.updateOne(
    {
      _id: userId,
    },
    {
      $inc: {
        balance: -amount,
      },
    },
  ).session(session);

  await Accounts.updateOne({
    _id: to,
  }, {
    $inc: {
      balance: amount
    }
  }).session(session);

  await session.commitTransaction();

  res.status(200).json({
    message: "Transfer Successfull",
  })
});

module.exports = {
  router,
};

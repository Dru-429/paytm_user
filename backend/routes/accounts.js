const express = require("express");
const authmiddleware = require("../middelware");
const { Accounts } = require("../models/db");

const router = express.Router();
router.use(express.json());

//accounts/balance
router.get("/balance", authmiddleware, async (req, res) => {
  const { userId } = parseInt(req.body);

  const balanceAccount = await Accounts.findById(userId);
  const balance = balanceAccount.balance

  res.status(200).send({
    balance
  });
});

module.exports = {
  router,
};

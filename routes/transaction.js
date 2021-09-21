const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transaction.controller");
const checkAuth = require("../middleware/auth")

router.post('/fund', checkAuth.authUser, transactionController.fundAccount);
router.post(
  "/send_money",
  checkAuth.authUser,
  transactionController.sendMoney
);

module.exports = router;
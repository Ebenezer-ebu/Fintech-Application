const express = require("express");
const router = express.Router();

const beneficiaryController = require("../controllers/beneficiary.controller");
const checkAuth = require("../middleware/auth");

router.post("/beneficiary", checkAuth.authUser, beneficiaryController.addBeneficiary);

module.exports = router;

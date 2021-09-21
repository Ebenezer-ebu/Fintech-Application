const express = require("express");

const userRoute = require("./routes/user");
const transferRoute = require("./routes/transaction");
const beneficiaryRoute = require("./routes/beneficiary");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/apis/v1/user", userRoute);
app.use("/apis/v1/transfer", transferRoute);
app.use("/apis/v1/add", beneficiaryRoute);

module.exports = app;

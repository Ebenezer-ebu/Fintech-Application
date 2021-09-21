const Validator = require("fastest-validator");
const request = require("request");
const { initializePayment, verifyPayment } =
  require("../config/paystack")(request);
const models = require("../models");

const fundAccount = async (req, res) => {
  const form = {
    amount: req.body.amount,
    description: req.body.description,
    typeOfTransaction: req.body.typeOfTransaction,
    email: req.userData.email,
    name: req.userData.name,
  };
  form.metadata = {
    full_name: form.name,
  };
  form.amount *= 100;

  const data = {
    amount: req.body.amount,
    userId: req.userData.userId,
    description: req.body.description,
    typeOfTransaction: req.body.typeOfTransaction,
  };

  const schema = {
    amount: { type: "number", optional: false, positive: true },
    description: { type: "string", optional: false, max: "500" },
    typeOfTransaction: {
      type: "string",
      items: "string",
      enum: ["card", "bank transfer"],
    },
  };
  const v = new Validator();
  const validationResponse = v.validate(data, schema);

  if (validationResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validationResponse,
    });
  } else {
    initializePayment(form, (error, body) => {
      if (error) {
        //handle errors
        console.log(error);
        return;
      }
      response = JSON.parse(body);
      console.log(response);
      let ref = response.data.reference;
      verifyPayment(ref, (error, body) => {
        if (error) {
          //handle errors appropriately
          res.status(500).json({
            message: "Something went wrong",
            error,
          });
          return;
        }
        response = JSON.parse(body);
        models.User.increment(
          { accountbalance: req.body.amount },
          {
            where: { id: req.userData.userId },
          }
        );
        models.Mytransaction.create(data)
          .then((result) => {
            res.status(201).json({
              message: "Transaction successful",
              transaction: result,
              response,
            });
          })
          .catch((error) => {
            res.status(500).json({
              message: "Something went wrong",
              error,
            });
          });
      });
    });
  }
};

const sendMoney = (req, res) => {
  const form = {
    amount: req.body.amount,
    description: req.body.description,
    typeOfTransaction: req.body.typeOfTransaction,
    email: req.userData.email,
    name: req.userData.name,
  };
  form.metadata = {
    full_name: form.name,
  };
  form.amount *= 100;

  const data = {
    amount: req.body.amount,
    userId: req.userData.userId,
    reciever: req.body.email,
    description: req.body.description,
    typeOfTransaction: req.body.typeOfTransaction,
  };

  const schema = {
    amount: { type: "number", optional: false, positive: true },
    reciever: { type: "string", optional: false, max: "256" },
    description: { type: "string", optional: false, max: "500" },
    typeOfTransaction: {
      type: "string",
      items: "string",
      enum: ["card", "bank transfer"],
    },
  };
  const v = new Validator();
  const validationResponse = v.validate(data, schema);
  if (validationResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validationResponse,
    });
  } else {
    models.Beneficiary.findOne({
      where: { beneficiary: req.body.email, userId: req.userData.userId },
    })
      .then((result) => {
        if (!result) {
          return res.status(404).json({
            message: `User ${req.body.email} is not among your beneficiaries`,
          });
        } else {
          models.User.findOne({
            where: {
              id: req.userData.userId,
            },
          }).then((result) => {
            if (result.accountbalance < req.body.amount) {
              return res.status(400).json({
                message: "Insufficient Balance",
                balance: result.accountbalance,
              });
            } else {
              initializePayment(form, (error, body) => {
                if (error) {
                  //handle errors
                  console.log(error);
                  return;
                }
                  response = JSON.parse(body);
                  
                let ref = response.data.reference;
                verifyPayment(ref, (error, body) => {
                  if (error) {
                    //handle errors appropriately
                    res.status(500).json({
                      message: "Something went wrong",
                      error,
                    });
                    return;
                  }
                  response = JSON.parse(body);
                  console.log(response);
                  models.User.decrement(
                    { accountbalance: req.body.amount },
                    {
                      where: { id: req.userData.userId },
                    }
                  );
                  models.User.increment(
                    { accountbalance: req.body.amount },
                    {
                      where: { email: req.body.email },
                    }
                  );
                  models.Transaction.create(data)
                    .then((result) => {
                      res.status(201).json({
                        message: "Transaction successful",
                        transaction: result,
                        response,
                      });
                    })
                    .catch((error) => {
                      res.status(500).json({
                        message: "Something went wrong",
                        error,
                      });
                    });
                });
              });
            }
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          message: "Something went wrong",
          error,
        });
      });
  }
};

module.exports = { fundAccount, sendMoney };

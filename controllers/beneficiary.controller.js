const Validator = require("fastest-validator");
const models = require("../models");

const addBeneficiary = (req, res) => {
    console.log(req.userData);
  const data = {
    beneficiary: req.body.email,
    userId: req.userData.userId,
  };
  const schema = {
    beneficiary: { type: "string", optional: false },
  };
  const v = new Validator();
  const validationResponse = v.validate(data, schema);
  if (validationResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validationResponse,
    });
  } else {
    models.User.findOne({ where: { email: req.body.email } })
      .then((result) => {
        if (!result) {
          return res.status(400).json({
            message: "No user with that email exists you can't add a beneficiary that is not registered",
          });
        } 
        else {
          models.Beneficiary.create(data)
            .then((result) => {
              return res.status(201).json({
                message: "Beneficiary created successfully",
                result,
              });
            })
            .catch((error) => {
              return res.status(500).json({
                message: "Something went wrong",
                error,
              });
            });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          message: "Something went wrong",
          errors: err,
        });
      });
  }
};

module.exports = { addBeneficiary };

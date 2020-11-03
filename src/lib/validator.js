const { equal } = require('@hapi/joi');
const Joi = require('@hapi/joi');


// Register Validation

const registerValidation = (data) => {
  const Schema =Joi.object( {
    username : Joi.string().min(6).required(),
    email : Joi.string().email().required(),
    password : Joi.string().min(6).required(),
    repassword : Joi.string().min(6).required(),
  });
  return Schema.validate(data);
};


const loginValidation = (data) => {
  const Schema = Joi.object({
    username : Joi.string().required(),
    password : Joi.string().required(),
  });
  return Schema.validate(data);
};
const emailValidation = (data) => {
  const Schema = Joi.object({
    email : Joi.string().email().required(),
  });
  return Schema.validate(data);
};


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.emailValidation = emailValidation;
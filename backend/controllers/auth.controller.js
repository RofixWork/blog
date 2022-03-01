const asynHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const validator = require("validator/validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const register = asynHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];
  // chack fields and push error inner array => Errors
  //   name
  validator.isEmpty(name) && errors.push("Please Enter Your Name");
  name &&
    validator.isLength(name, { max: 2 }) &&
    errors.push("name is shorter than the minimum allowed length (3)");

  // email

  validator.isEmpty(email) && errors.push("Please Enter Your email");
  email &&
    !validator.isEmail(email) &&
    errors.push("Email Adress in invalid format");

  // password
  validator.isEmpty(password) && errors.push("Please Enter Your password");
  password &&
    validator.isLength(password, { max: 5 }) &&
    errors.push("password is shorter than the minimum allowed length (6)");

  //   check email exist or not
  const emailExist = await User.findOne({ email });

  if (emailExist) {
    errors.push("This email is Exist, PLease Enter another email");
  }

  if (errors.length) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors });
  }

  const user = await User.create({ ...req.body });

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
});

const login = asynHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];
  // email

  validator.isEmpty(email) && errors.push("Please Enter Your email");
  email &&
    !validator.isEmail(email) &&
    errors.push("Email Adress in invalid format");

  // password
  validator.isEmpty(password) && errors.push("Please Enter Your password");

  // check email user => exist or not
  const user = await User.findOne({ email });

  if (email && !user) {
    errors.push("This email not Exist, Please try again");
  }

  if (user) {
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (password && !isPasswordCorrect) {
      errors.push("This Password not correct, Please try again");
    }
  }

  if (errors.length) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors });
  }

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
});

module.exports = { register, login };

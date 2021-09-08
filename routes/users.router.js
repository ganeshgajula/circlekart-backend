const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const { extend } = require("lodash");
const { User } = require("../models/user.model");

router.route("/signup").post(async (req, res) => {
  try {
    const userData = req.body;

    const user = await User.findOne({ email: userData.email });

    if (!user) {
      const newUser = new User(userData);
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(newUser.password, salt);
      const savedUser = await newUser.save();
      return res.status(201).json({ success: true, savedUser });
    }
    return res.status(409).json({
      success: false,
      message:
        "You already have an account with this email,kindly login with the password",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Couldn't register user, kindly check the error message for more details",
      errorMessage: error.message,
    });
  }
});

router.route("/login").post(async (req, res) => {
  try {
    const email = req.get("email");
    const password = req.get("password");
    const user = await User.findOne({ email });

    const validPassword = await bcrypt.compare(password, user.password);
    if (user && validPassword) {
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
        expiresIn: "24h",
      });
      return res.status(200).json({
        success: true,
        userDetails: { userId: user._id, firstname: user.firstname, token },
      });
    } else if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "This email is not registered with us. Kindly, go to signup page and create a new account",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Password is incorrect, please enter the correct password",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Kindly check the error message for more details",
      errorMessage: error.message,
    });
  }
});

router.param("email", async (req, res, next, id) => {
  try {
    const user = await User.findOne({ email: id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not registered with this email",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Couldn't find user with this email, check error message for more details",
      errorMessage: error.message,
    });
  }
});

router.route("/:email").post(async (req, res) => {
  try {
    let { user } = req;
    const userUpdates = req.body;
    user = extend(user, userUpdates);
    const updatedUserDetails = await user.save();
    res.json({ success: true, updatedUserDetails });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Couldn't update user details, kindly check the error message for more details",
      errorMessage: error.message,
    });
  }
});

module.exports = router;

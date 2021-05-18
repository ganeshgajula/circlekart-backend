const express = require("express");
const router = express.Router();
const { extend } = require("lodash");
const { User } = require("../models/user.model");

router.route("/").post(async (req, res) => {
  try {
    const userData = req.body;

    const user = await User.findOne({ email: userData.email });

    if (!user) {
      const newUser = new User(userData);
      const savedUser = await newUser.save();
      res.status(201).json({ success: true, savedUser });
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

router.route("/authenticate").post(async (req, res) => {
  try {
    const email = req.get("email");
    const password = req.get("password");
    const user = await User.findOne({ email });

    if (user && user.password === password) {
      return res.status(200).json({
        success: true,
        userDetails: { userId: user._id, firstname: user.firstname },
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

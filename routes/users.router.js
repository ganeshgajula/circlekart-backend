const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const { extend } = require("lodash");
const { User } = require("../models/user.model");
const { route } = require("./products.router");

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
        "User already registered with entered email. Kindly login or create a new account.",
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

    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
          expiresIn: "24h",
        });
        return res.status(200).json({
          success: true,
          userDetails: {
            userId: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            token: `Bearer ${token}`,
          },
        });
      }
      return res.status(401).json({
        success: false,
        message:
          "Incorrect user credentials, kindly login with correct credentials",
      });
    }
    return res.status(401).json({
      success: false,
      message:
        "This email is not registered with us. Kindly, visit signup page and create a new account",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Kindly check the error message for more details",
      errorMessage: error.message,
    });
  }
});

router.param("userId", async (req, res, next, id) => {
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Couldn't find user, check error message for more details",
      errorMessage: error.message,
    });
  }
});

router
  .route("/:userId")
  .get(async (req, res) => {
    try {
      let { user } = req;
      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Couldn't get user details",
        errorMessage: error.message,
      });
    }
  })
  .post(async (req, res) => {
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

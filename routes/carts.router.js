const express = require("express");
const router = express.Router();
const { extend } = require("lodash");
const { User } = require("../models/user.model");
const { Cart } = require("../models/cart.model");
const Razorpay = require("razorpay");
const { nanoid } = require("nanoid");
const crypto = require("crypto");

router.param("userId", async (req, res, next, id) => {
  try {
    const { user } = req;

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }

    let cart = await Cart.findOne({ userId: id });

    if (!cart) {
      cart = new Cart({ userId: id, products: [] });
      cart = await cart.save();
    }

    req.cart = cart;
    next();
  } catch (error) {
    res.status(500).json({
      succcess: false,
      message:
        "Couldn't load user's cart, kindly check the error message for more details",
      errorMessage: error.message,
    });
  }
});

router
  .route("/:userId/cart")
  .get(async (req, res) => {
    try {
      let { cart } = req;

      cart = await cart.populate({ path: "products.productId" }).execPopulate();

      const activeProducts = cart.products.filter(
        (product) => product.isActive
      );

      res.status(200).json({ success: true, cart: activeProducts });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Couldn't find cart items of user, kindly check error message for more details",
        errorMessage: error.message,
      });
    }
  })
  .post(async (req, res) => {
    try {
      let { cart } = req;
      const productUpdates = req.body;

      const isProductAlreadyAddedInCart = cart.products.find(
        (product) => product.productId == productUpdates._id
      );

      isProductAlreadyAddedInCart
        ? cart.products.map((product) => {
            if (product.productId == productUpdates._id) {
              product = extend(product, productUpdates);
            }
          })
        : cart.products.push({
            productId: productUpdates._id,
            quantity: 1,
            isActive: true,
          });

      let updatedCart = await cart.save();
      updatedCart = await updatedCart
        .populate({ path: "products.productId" })
        .execPopulate();

      const activeProductsInCart = updatedCart.products.filter(
        (product) => product.isActive
      );

      res.status(200).json({ success: true, cart: activeProductsInCart });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Couldn't add product to cart, kindly check the error message for more details",
        errorMessage: error.message,
      });
    }
  });

router.route("/checkout").post(async (req, res) => {
  try {
    const { orderInfo } = req.body;

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: orderInfo.totalAmount * 100,
      currency: "INR",
      receipt: nanoid(),
      payment_capture: 1,
    };

    const order = await instance.orders.create(options);
    console.log(order);

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Couldn't complete transaction, kindly check the error message for more details",
      errorMessage: error.message,
    });
  }
});

router.route("/verifypayment").post(async (req, res) => {
  try {
    const secret = process.env.WEBHOOK_SECRET;
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest === req.headers["x-razorpay-signature"]) {
      console.log("Legit request");
      res.json({ status: "ok", success: true, message: "verfied payment" });
    } else {
      res.status(401).json({ success: false, message: "unauthorized access" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Couldn't verify transaction",
      errorMessage: error.message,
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { extend } = require("lodash");
const { User } = require("../models/user.model");
const { Cart } = require("../models/cart.model");

router.param("userId", async (req, res, next, id) => {
  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ success: false, message: "user not found" });
    }

    req.userDetails = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Couldn't find user, please check the error message for more details",
    });
  }
});

router.param("userId", async (req, res, next, id) => {
  try {
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

module.exports = router;

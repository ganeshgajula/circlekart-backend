const express = require("express");
const router = express.Router();
const { Wishlist } = require("../models/wishlist.model");
const { User } = require("../models/user.model");

router.param("userId", async (req, res, next, id) => {
  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Couldn't find user, kindly check the error message for more details",
      errorMessage: error.message,
    });
  }
});

router.param("userId", async (req, res, next, id) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: id });

    if (!wishlist) {
      wishlist = new Wishlist({ userId: id, products: [] });
      wishlist = await wishlist.save();
    }

    req.wishlist = wishlist;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "couldn't find wishlist, kindly check the error message for more details",
      errorMessage: error.message,
    });
  }
});

router
  .route("/:userId/wishlist")
  .get(async (req, res) => {
    try {
      let { wishlist } = req;

      wishlist = await wishlist
        .populate({ path: "products.productId" })
        .execPopulate();

      const activeProducts = wishlist.products.filter(
        (product) => product.isActive
      );

      res.status(200).json({ success: true, wishlist: activeProducts });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Couldn't load wishlist, kindly check the error message for more details",
        errorMessage: error.message,
      });
    }
  })
  .post(async (req, res) => {
    try {
      let { wishlist } = req;
      const productUpdates = req.body;

      const isProductAlreadyAddedInWishlist = wishlist.products.find(
        (product) => product.productId == productUpdates._id
      );

      isProductAlreadyAddedInWishlist
        ? wishlist.products.map((product) => {
            if (product.productId == productUpdates._id) {
              product.isActive = !product.isActive;
            }
          })
        : wishlist.products.push({
            productId: productUpdates._id,
            isActive: true,
          });

      let updatedWishlist = await wishlist.save();
      updatedWishlist = await updatedWishlist
        .populate({ path: "products.productId" })
        .execPopulate();

      const activeProducts = updatedWishlist.products.filter(
        (product) => product.isActive
      );

      res.status(200).json({ success: true, wishlist: activeProducts });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Couldn't add or update the wishlist, kindly check the error message for more details",
        errorMessage: error.message,
      });
    }
  });

module.exports = router;

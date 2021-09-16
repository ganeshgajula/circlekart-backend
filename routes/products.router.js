const express = require("express");
const router = express.Router();
const { Product } = require("../models/product.model");
const { extend } = require("lodash");

router
  .route("/")
  .get(async (req, res) => {
    try {
      const products = await Product.find({});
      res.json({ success: true, products });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "unable to get products, please check error message for more info",
        errorMessage: error.message,
      });
    }
  })
  .post(async (req, res) => {
    try {
      const productAdded = req.body;
      const NewProduct = new Product(productAdded);
      const savedProduct = await NewProduct.save();
      res.status(201).json({ success: true, product: savedProduct });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "couldn't add products",
        errorMessage: error.Message,
      });
    }
  });

router.param("productId", async (req, res, next, id) => {
  try {
    const matchedProduct = await Product.findById(id);

    if (!matchedProduct) {
      return res.status(400).json({
        success: false,
        message: "The product you are trying to access is not available.",
      });
    }

    req.product = matchedProduct;

    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        "Error while retrieving the product, kindly check the error message for more details",
      errorMessage: error.message,
    });
  }
});

router
  .route("/:productId")
  .get(async (req, res) => {
    try {
      const { product } = req;
      product.__v = undefined;
      res.json({ success: true, product });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          "Looks like something broke, kindly look into error message for more details",
        errorMessage: error.message,
      });
    }
  })
  .post(async (req, res) => {
    try {
      const productUpdates = req.body;
      let { product } = req;
      product = extend(product, productUpdates);
      const updatedProduct = await product.save();
      res.json({ success: true, updatedProduct });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Could not update product details, kindly look into error message for more details",
        errorMessage: error.message,
      });
    }
  })
  .delete(async (req, res) => {
    try {
      let { product } = req;
      await product.remove();
      res.json({ success: true, product });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          "Looks like something broke, kindly look into the error message for more details",
        errorMessage: error.message,
      });
    }
  });

module.exports = router;

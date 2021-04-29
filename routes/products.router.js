const express = require("express");
const router = express.Router();
const { Product } = require("../models/product.model");

router
  .route("/")
  .get(async (req, res) => {
    try {
      const products = await Product.findById({});
      res.json({ success: true, products });
    } catch (err) {
      res.status(500).json({
        success: false,
        message:
          "unable to get products, please check error message for more info",
        errorMessage: err.message,
      });
    }
  })
  .post(async (req, res) => {
    try {
      const productAdded = req.body;
      const NewProduct = new Product(productAdded);
      const savedProduct = await NewProduct.save();
      res.status(201).json({ success: true, product: savedProduct });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "couldn't add products",
        errorMessage: err.Message,
      });
    }
  });

module.exports = router;

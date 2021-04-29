const mongoose = require("mongoose");
// require("mongoose-type-url");

const ProductSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: "Product image must be added",
    },
    name: {
      type: String,
      required: "Product name must be mentioned",
    },
    price: {
      type: Number,
      required: "Product price must be mentioned",
    },
    inStock: {
      type: Boolean,
      required: "Product stock availability status must be mentioned",
    },
    level: {
      type: String,
      required: "Product level must be mentioned",
    },
    fastDelivery: {
      type: Boolean,
      required: "Product delivery status must be mentioned",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = { Product };

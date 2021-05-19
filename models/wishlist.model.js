const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      isActive: Boolean,
    },
  ],
});

const Wishlist = mongoose.model("Wishlist", WishlistSchema);

module.exports = { Wishlist };

const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Review = require("../models/review");
const { isLoggedIn } = require("../middleware");

router.get("/product/:id/reviews", isLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate("owner");

    res.render("review/review", { product });
  } catch (e) {
    next(e);
  }
});

router.post("/product/:id/reviews", isLoggedIn, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("buyer");
    const review = new Review(req.body.review);

    review.owner = req.user._id;

    product.review.push(review);

    await review.save();
    await product.save();
    res.redirect(`/product/${product._id}`);
  } catch (e) {
    next(e);
  }
});

router.delete("/product/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    await Product.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/product/${id}`);
  } catch (e) {
    next(e);
  }
});

module.exports = router;

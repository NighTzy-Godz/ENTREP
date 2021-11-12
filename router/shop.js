const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const User = require("../models/user");
const { isLoggedIn } = require("../middleware");

router.get("/product/:id/checkout", isLoggedIn, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("owner");

    const user = await User.findById(req.user._id).populate("productsBought");

    res.render("user/checkout", { product, user });
  } catch (e) {
    next(e);
  }
});

router.post("/product/:id/checkout/buy", isLoggedIn, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("owner");
    const user = await User.findById(req.user._id);

    const { gcash, name, cardNumber, cvv, expire } = req.body;

    if (gcash.length !== 11) {
      req.flash("error", "Incomplete Number");
      return res.redirect(`/product/${product._id}/checkout`);
    }

    if (name.length === 0) {
      req.flash("error", "Name Can't Be Empty");
      return res.redirect(`/product/${product._id}/checkout`);
    }

    if (cardNumber.length !== 16) {
      req.flash("error", "Incomplete Card Number");
      return res.redirect(`/product/${product._id}/checkout`);
    }

    if (cvv.length !== 3) {
      req.flash("error", "Incomplete CVV Number");
      return res.redirect(`/product/${product._id}/checkout`);
    }

    if (expire.length !== 4) {
      req.flash("error", "Incomplete Expiry Number");
      return res.redirect(`/product/${product._id}/checkout`);
    }

    product.buyer.push(user);
    product.owner.balance += product.price;

    user.moneySpent += product.price;
    user.productsBought.push(product);

    await user.save();
    await product.save();

    res.redirect("/purchase");
  } catch (e) {
    next(e);
  }
});

module.exports = router;

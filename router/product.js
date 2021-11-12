const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const User = require("../models/user");
// const ExpressError = require("../utils/expressErr");
const { isOwner, isLoggedIn } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary/cloudinary");
const upload = multer({ storage });

// const validateProduct = (req, res, next) => {
//   const { error } = productSchema.validate(req.body);
//   if (error) {
//     const msg = error.details.map((err) => err.message).join(",");
//     console.log(msg);
//     throw new ExpressError(msg, 400);
//   } else {
//     next();
//   }
// };

router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.render("product/products", { products });
  } catch (e) {
    next(e);
  }
});

router.get("/create", isLoggedIn, (req, res, next) => {
  try {
    res.render("product/create");
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate({
        path: "review",
        populate: {
          path: "owner",
        },
      })
      .populate("owner");
    res.render("product/productDetail", { product });
  } catch (e) {
    next(e);
  }
});

router.get("/:id/edit", isLoggedIn, isOwner, async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("product/edit", { product });
  } catch (e) {
    next(e);
  }
});

router.post("/", upload.array("img"), isLoggedIn, async (req, res, next) => {
  try {
    const product = new Product(req.body);
    const user = await User.findById(req.user._id);

    user.createdProduct.push(product);

    product.owner = req.user._id;
    product.img = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));

    await product.save();
    await user.save();
    req.flash("success", "Successfully created the product!");

    res.redirect("/product");
  } catch (e) {
    next(e);
  }
});

router.put(
  "/:id",
  upload.array("img"),
  isLoggedIn,

  isOwner,
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const product = await Product.findByIdAndUpdate(id, req.body);

      const imgs = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
      }));

      product.img.push(...imgs);
      await product.save();
      res.redirect(`/product/${product._id}`);
    } catch (e) {
      next(e);
    }
  }
);

router.delete("/:id", isLoggedIn, isOwner, async (req, res, next) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect("/product");
  } catch (e) {
    next(e);
  }
});

module.exports = router;

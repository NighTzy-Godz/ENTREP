const Product = require("./models/product");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.undoUrl = req.originalUrl;
    req.flash("error", "You Must Be Signed In");
    return res.redirect("/login");
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product.owner.equals(req.user._id)) {
    req.flash("error", "You're Not The Owner Of This Product");
    return res.redirect(`/product/${product._id}`);
  }
  next();
};

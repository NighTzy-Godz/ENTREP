const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const { isLoggedIn } = require("../middleware");

const checkCredentials = (req, res, next) => {
  const { firstName, lastName, password, password2, age } = req.body;

  if (password !== password2) {
    req.flash("error", "Passwords Didnt Match");
    return res.redirect("/register");
  } else if (password.length < 5) {
    req.flash("error", "Passwords Must Be 5 Character Long");
    return res.redirect("/register");
  } else if (firstName.length < 2 || firstName.length > 20) {
    req.flash(
      "error",
      "First Name Should Be Longer Than 6 Characters and Less Than 20 Characters"
    );
    return res.redirect("/register");
  } else if (lastName.length < 2 || firstName.length > 20) {
    req.flash(
      "error",
      "Last Name Should Be Longer Than 6 Characters and Less Than 20 Characters"
    );
    return res.redirect("/register");
  } else if (age < 13) {
    req.flash("error", "It is only available for 13 years old and above");
    return res.redirect("/register");
  } else {
    next();
  }
};

router.get("/register", (req, res, next) => {
  try {
    res.render("user/register");
  } catch (e) {
    next(e);
  }
});

router.get("/purchase", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "productsBought",
      populate: {
        path: "owner",
      },
    });

    res.render("user/purchase", { user });
  } catch (e) {
    next(e);
  }
});

router.post("/register", checkCredentials, async (req, res, next) => {
  try {
    const { username, email, firstName, lastName, age, password } = req.body;

    const user = new User({ username, firstName, lastName, email, age });
    const registered = await User.register(user, password);
    req.login(registered, (err) => {
      if (err) return next(e);
    });
    req.flash(
      "success",
      `Successfully Created An Account For ${firstName} ${lastName}`
    );
    res.redirect("/product");
  } catch (e) {
    req.flash("error", e.message);

    res.redirect("/register");
    next(e);
  }
});

router.get("/login", (req, res, next) => {
  try {
    res.render("user/login");
  } catch (e) {
    next(e);
  }
});

router.get("/profile", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("productsBought");
    console.log(user);
    res.render("user/profile", { user });
  } catch (e) {
    next(e);
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    try {
      const user = req.session.passport.user;
      req.flash("success", `Welcome Back ${user}`);
      const redirectUrl = req.session.undoUrl || "/product";
      delete req.session.undoUrl;
      res.redirect(redirectUrl);
    } catch (e) {
      req.flash("error", "Credentials Didnt Match");
      res.redirect("/login");
    }
  }
);

router.get("/logout", (req, res, next) => {
  try {
    req.logout();
    req.flash("success", "Logged Out");
    res.redirect("/login");
  } catch (e) {
    next(e);
  }
});
module.exports = router;

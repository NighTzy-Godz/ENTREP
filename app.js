if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT;

const compression = require("compression");

const mongoose = require("mongoose");

const methodOverride = require("method-override");

const ExpressError = require("./utils/expressErr");

const morgan = require("morgan");
const ejsMate = require("ejs-mate");

const flash = require("connect-flash");
const session = require("express-session");

const productRoute = require("./router/product");
const reviewRoute = require("./router/review");
const userRoute = require("./router/user");
const shopRoute = require("./router/shop");
const chatRoute = require("./router/chat");

const User = require("./models/user");

const passport = require("passport");
const LocalStrat = require("passport-local");

const dbUrl = process.env.DB_URL;
const MongoStore = require("connect-mongo");

mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("SUCCESSFULL COONNECTED ON THE DATABASE");
  })
  .catch((e) => {
    console.log("OH NO THERE'S AN ERROR!");
    console.log(e);
  });

app.use(morgan("tiny"));

app.use(compression());

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "staticfiles")));
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/templates"));

const secret = process.env.SECRET || "THIS_IS_THE_SECRET";

const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret: secret,

  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("Error Bro", e);
});

const sessionConfig = {
  store: store,
  secret: "THISISASECRET",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
    maxAge: 100 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrat(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/product", productRoute);
app.use("/", reviewRoute);
app.use("/", userRoute);
app.use("/", shopRoute);
app.use("/", chatRoute);

// app.use("/product/:id/reviews", reviewRoute);

// PRODUCT RESTFUL -- CRUD METHOD

app.get("/", (req, res) => {
  res.render("base/home");
});

app.get("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (!err.message) err.message = "Something Went Wrong Bro";
  res.status(statusCode).send(message);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

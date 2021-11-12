const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    min: 7,
    max: 20,
  },

  lastName: {
    type: String,
    required: true,
    min: 7,
    max: 20,
  },

  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  age: {
    type: String,
    required: true,
  },

  productsBought: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],

  createdProduct: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],

  paymentMethod: {
    type: String,
    enum: ["G-Cash", "Credit Card"],
    default: "Credit Card",
  },

  earnings: {
    type: Number,
    default: 0,
  },
  moneySpent: {
    type: Number,
    default: 0,
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const productSchema = new Schema({
  productName: String,
  img: [
    {
      url: String,
      filename: String,
    },
  ],
  desc: String,
  price: Number,
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  buyer: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

productSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.remove({
      _id: {
        $in: doc.review,
      },
    });
  }
});

module.exports = mongoose.model("Product", productSchema);

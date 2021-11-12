// const mongoose = require("mongoose");
// const Product = require("../models/product");
// const { descriptors, place } = require("./helper");

// mongoose
//   .connect("mongodb://localhost:27017/artelier", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("SUCCESSFULL COONNECTED ON THE DATABASE");
//   })
//   .catch((e) => {
//     console.log("OH NO THERE'S AN ERROR!");
//     console.log(e);
//   });

// // const sample = (array) => array[Math.floor(Math.random() * array.length)];

// const generate = (array) => array[Math.floor(Math.random() * array.length)];

// const seed = async () => {
//   await Product.deleteMany({});
//   for (let i = 0; i < 7; i++) {
//     const price = Math.floor(Math.random() * 400);
//     const product = new Product({
//       price: price,
//       desc: " Lorem ipsum dolor sit amet consectetur, adipisicing elit. Architecto eius, quisquam dolor reprehenderit distinctio ad nihil harum ratione facere recusandae iure odit quod?",
//       img: "https://source.unsplash.com/collection/483251",
//       productName: `${generate(descriptors)} ${generate(place)}`,
//     });
//     await product.save();
//   }
// };

// seed().then(() => {
//   mongoose.connection.close();
// });

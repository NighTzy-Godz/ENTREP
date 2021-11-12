const Joi = require("joi");

module.exports.productSchema = Joi.object({
  product: Joi.object({
    productName: Joi.string().required(),
    price: Joi.number().required().min(0),
    desc: Joi.string().required().min(10),
    img: Joi.array().required(),
  }).required(),
});

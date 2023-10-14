// const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Schema;

// const userOrderSchema = new mongoose.Schema(
//   {
//     products: [
//       {
//         product: { type: ObjectId, ref: "Product" },
//         count: Number,
//       },
//     ],
//     paymentIntent: {
//       id: String,
//       object: String,
//       amount: Number,
//       // ... add other fields from paymentIntent as needed
//       status: String,
//     },
//     orderStatus: {
//       type: String,
//       default: "Not Processed",
//       enum: ["Not Processed", "Processing", "Dispatched", "Delivered", "Cancelled"], // Add statuses as needed
//     },
//     orderedBy: {
//       type: ObjectId,
//       ref: "User",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Order", userOrderSchema);

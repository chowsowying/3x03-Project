const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const formSchema = new mongoose.Schema(
  {
    title: {
        type: String,
        required: true,
        maxlength: 32,
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000,
    },
    sender: {
        type: String,
        required:true,
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("Form", formSchema);
  
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.DB_URL);

const formSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    minLength: 6,
  },
  number: {
    type: Number,
    required: true,
  },
  food: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

// Create a model from the schema
const Form = mongoose.model("Form", formSchema);

module.exports = {
  Form,
};

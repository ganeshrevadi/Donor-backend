const express = require("express");
const cors = require("cors");
const { Form } = require("./db");
const dotenv = require("dotenv");
dotenv.config();

const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

// Configure your email transport
const transporter = nodemailer.createTransport({
  service: "gmail", // or any other email service
  auth: {
    user: "ganeshrevadi16@gmail.com", // Your email
    pass: process.env.PASS, // Your email password or app password
  },
});

app.get("/getuser/:id", async (req, res) => {
  const number = req.params.id;
  try {
    const user = await Form.findOne({ number: number });

    if (user) {
      // Send email
      const mailOptions = {
        from: "ganeshrevadi16@gmail.com",
        to: user.email, // Send email to the user
        subject: "Keep food ready for pickup",
        text: `Hello ${user.name} we are out for picking up the food. Please keep the food ready at ${user.location}. We will be there in 30 minutes.`,
      };

      await transporter.sendMail(mailOptions);

      res.json({
        message: "User details fetched and email sent successfully",
        user: user,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/form", async (req, res) => {
  const name = req.body.name;

  if (name == null) {
    return res.status(400).json({
      message: "Name is required",
    });
  }

  const form = await Form.create({
    name: req.body.name,
    email: req.body.email,
    number: req.body.number,
    food: req.body.food,
    location: req.body.location,
    quantity: req.body.quantity,
  });
  const userId = form._id;

  res.status(200).json({
    message: "User created " + userId,
  });
});

app.get("/bulk", async (req, res) => {
  const forms = await Form.find();
  res.json({
    form: forms.map((form) => {
      return {
        name: form.name,
        email: form.email,
        number: form.number,
        food: form.food,
        location: form.location,
        quantity: form.quantity,
      };
    }),
  });
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const del = await Form.deleteOne({ number: req.params.id });
    if (!del) {
      return res.status(404).json({ message: "ID not found" });
    }
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

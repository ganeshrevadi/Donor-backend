const express = require("express");
const cors = require("cors");
const { Form } = require("./db");
const dotenv = require("dotenv");
dotenv.config();

// const nodemailer = require("nodemailer");
const axios = require("axios");
const app = express();

app.use(cors());
app.use(express.json());

app.post("/getuser/:id", async (req, res) => {
  const number = req.params.id;
  try {
    const user = await Form.findOne({ number: number });

    if (user) {
      const messageBody = `Hello ${user.name}, we are out for picking up the food. Please keep the food ready at ${user.location}. We will be there in 30 minutes.`;

      const API_TOKEN = process.env.API_TOKEN;
      const SINCH_NUMBER = process.env.SINCH_NUMBER;
      const TO_NUMBER = ["+91" + user.number];
      const SINCH_URL = process.env.SINCH_URL;
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + API_TOKEN,
      };
      const payload = JSON.stringify({
        from: SINCH_NUMBER,
        to: TO_NUMBER,
        body: messageBody,
      });

      await axios
        .post(SINCH_URL, payload, { headers })
        .then((response) => console.log(response.data))
        .catch((error) => console.error("There was an error!", error.response));

      res.json({
        message: "User details fetched and SMS sent successfully",
        user: user.name,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// app.post("/getuser/:id", async (req, res) => {
//   const number = req.params.id;
//   try {
//     const user = await Form.findOne({ number: number });

//     if (user) {
//       // Send email
//       const mailOptions = {
//         from: "ganeshrevadi16@gmail.com",
//         to: user.email, // Send email to the user
//         subject: "Keep food ready for pickup",
//         text: `Hello ${user.name} we are out for picking up the food. Please keep the food ready at ${user.location}. We will be there in 30 minutes.`,
//       };

//       await transporter.sendMail(mailOptions);

//       res.json({
//         message: "User details fetched and email sent successfully",
//         user: user.name,
//       });
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

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
      return res.status(403).json({ message: "ID not found" });
    }
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

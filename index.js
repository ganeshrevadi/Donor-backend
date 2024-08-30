const express = require("express");
const cors = require("cors");
const { Form } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
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
        quantity: form.quantity,
      };
    }),
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

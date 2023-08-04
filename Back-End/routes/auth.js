const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();
const SECRET = process.env.SECRET;
const validateRegister = require("../middlewares/validateRegister");
const validateLogin = require("../middlewares/validateLogin");

router.post("/auth/register", validateRegister, async (req, res) => {
  const { email, password } = req.body;

  // Generate salt to hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    res.json(newUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error creating user." });
  }
});

router.post("/auth/login", validateLogin, async (req, res) => {
  const { email } = req.body;

  const user = await prisma.users.findFirst({
    where: {
      email: email,
    },
  });
  try {
    const SECRET = process.env.SECRET;
    const token = jwt.sign({ user_id: user.user_id }, SECRET);

    res.status(200).json({
      user: user.email,
      msg: "Autenticado com sucesso!",
      token: token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error logging in user." });
  }
});



module.exports = router;

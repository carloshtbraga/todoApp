const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

async function validateLogin(req, res, next) {
  const { email, password } = req.body;
  const prisma = new PrismaClient();

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is required." });
  }

  const user = await prisma.users.findFirst({
    where: {
      email: email,
    },
  });

  if (user === null) {
    return res.status(404).json({ error: "User not found" });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).json({ error: "Password is incorrect." });
  }
  next();
}

module.exports = validateLogin;

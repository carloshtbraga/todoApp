const { PrismaClient } = require("@prisma/client");

async function validateRegister(req, res, next) {
    const { email, password } = req.body;
    const prisma = new PrismaClient();

    if(!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    if(!password) {
      return res.status(400).json({ error: "Password is required." });
    }

    const user = await prisma.users.findFirst({
        where: {
          email: email,
        },
      });
    
      if(user !== null) { 
        return res.status(400).json({ error: "Email already exists." });
      }
    next();
  }
  
  module.exports = validateRegister;
  
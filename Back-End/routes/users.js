const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const validateToken = require("../middlewares/validateToken");
const validateUserPermission = require("../middlewares/validateUserPermission");

const prisma = new PrismaClient();

router.get("/users/:id/tasks", validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    // Busca as tasks do usuário específico
    const tasks = await prisma.tasks.findMany({
      where: {
        user_id: Number(id),
      },
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error fetching tasks." });
  }
});

router.get("/users/:id", validateToken, async (req, res) => {
    try {
      const { id } = req.params;  
      // Busca os detalhes do usuário
      const user = await prisma.users.findUnique({
        where: {
          user_id: Number(id),
        },
        select: {
          email: true,
          // Outros campos que você deseja retornar
        },
      });
  
      // Verifica se o usuário foi encontrado
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Error fetching user." });
    }
  });


module.exports = router;

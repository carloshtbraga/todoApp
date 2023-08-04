const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();
const validateToken = require("../middlewares/validateToken");

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await prisma.tasks.findMany(); // Use o Prisma Client para buscar as tarefas
    res.json(tasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error fetching tasks." });
  }
});

router.post("/tasks", validateToken, async (req, res) => {
  try {
    const { task_name, task_description, task_completed } = req.body;
    const user_id = req.user.user_id;
    const newTask = await prisma.tasks.create({
      data: {
        task_name,
        task_description,
        task_completed,
        user: {
          connect: {
            user_id: user_id,
          },
        },
      },
    });
    res.json(newTask);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error creating task." });
  }
});

router.put("/tasks/:id", validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { task_name, task_description, task_completed } = req.body;
    const user_id = req.user.user_id; // Obtém o user_id do usuário autenticado
    // Busca a tarefa pelo task_id
    const task = await prisma.tasks.findUnique({
      where: {
        task_id: Number(id),
      },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    if (task.user_id !== user_id) {
      return res
        .status(403)
        .json({ error: "You don't have permission to edit this task." });
    }

    const updatedTask = await prisma.tasks.update({
      where: {
        task_id: Number(id),
      },
      data: {
        task_name,
        task_description,
        task_completed,
      },
    });

    res.json({ msg: "Update feito com sucesso", updatedTask });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error updating task." });
  }
});

router.delete("/tasks/:id", validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id; // Obtém o user_id do usuário autenticado
    // Busca a tarefa pelo task_id
    const task = await prisma.tasks.findUnique({
      where: {
        task_id: Number(id),
      },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    // Verifica se o user_id associado à tarefa é igual ao user_id do usuário autenticado
    if (task.user_id !== user_id) {
      return res
        .status(403)
        .json({ error: "You don't have permission to delete this task." });
    }

    // Deleta a tarefa
    await prisma.tasks.delete({
      where: {
        task_id: Number(id),
      },
    });

    res.json({ msg: "Task deleted successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error deleting task." });
  }
});

// router.get("/tasks/:id", validateToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user_id = req.user.user_id; // Obtém o user_id do usuário autenticado
//     // Busca a tarefa pelo task_id
//     const task = await prisma.tasks.findUnique({
//       where: {
//         task_id: Number(id),
//       },
//     });

//     if (!task) {
//       return res.status(404).json({ error: "Task not found." });
//     }

//     if (task.user_id !== user_id) {
//       return res.status(403).json({ error: "You don't have permission." });
//     }

//     res.status(200).json(task);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: "Error fetching task." });
//   }
// });

module.exports = router;

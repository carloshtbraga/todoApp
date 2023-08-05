const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


// Aqui eu valido a permissao e checo se existe o task


async function validateUserPermission(req, res, next) {
  const { id } = req.params;
  const user_id_token = req.user.user_id;

  try {
    // Busca a tarefa pelo task_id e inclui o relacionamento com o usuário associado
    const task = await prisma.tasks.findUnique({
      where: {
        task_id: Number(id),
      },
      include: {
        user: true,
      },
    });

    // Verifica se a tarefa foi encontrada no banco de dados
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    // Verifica se o user_id da tarefa é igual ao user_id do usuário autenticado
    if (task.user.user_id !== Number(user_id_token)) {
      return res.status(403).json({ error: "You don't have permission." });
    }

    // Se chegou até aqui, significa que o usuário tem permissão para atualizar a tarefa
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error validating user permission." });
  }
}

module.exports = validateUserPermission;

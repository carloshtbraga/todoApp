// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

// async function findTask(req, res, next) {
//     const { id } = req.params;
//   const task = await prisma.tasks.findUnique({
//     where: {
//       task_id: Number(id),
//     },
//   });
//   if (!task) {
//     return res.status(404).json({ error: "Task not found." });
//   }
//   next();
// }

// module.exports = findTask;

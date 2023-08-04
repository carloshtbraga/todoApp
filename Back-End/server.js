const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const tasksRoutes = require("./routes/tasks");
const usersRoutes = require("./routes/users");  

const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cors());

app.use(authRoutes);
app.use(tasksRoutes);
app.use(usersRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

app.get("/teste", (req, res) => {
  res.send("Hello World!");
});



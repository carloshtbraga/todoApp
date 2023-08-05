import { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import "../styles/Tasks.css";
import TasksCard from "./TasksCard";
import lista from "../assets/lista.png";
import voltar from "../assets/voltar.png";
import { Link } from "react-router-dom";

const Tasks = () => {
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({});

  const token = localStorage.getItem("token");
  const decodedToken = jwt_decode(token);
  const userId = decodedToken.user_id;

  const handleEdit = (taskId) => {
    const taskToEdit = tasks.find((task) => task.task_id === taskId);
    setEditingTask(taskToEdit);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/tasks/${editingTask.task_id}`,
        {
          task_name: editingTask.task_name,
          task_description: editingTask.task_description,
          task_completed: editingTask.task_completed,
        },
        {
          headers: {
            Authorization: `${token}`, // Coloque "Bearer" antes do token
          },
        }
      );

      // Atualize a lista de tarefas com a tarefa atualizada
      setTasks(
        tasks.map((task) =>
          task.task_id === editingTask.task_id
            ? response.data.updatedTask
            : task
        )
      );

      // Limpe o estado de edição
      setEditingTask(null);
    } catch (error) {
      console.log(error.response.data.error); // Armazenar a mensagem de erro no estado
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Envia a nova tarefa para o servidor
      const response = await axios.post(
        `http://localhost:8000/tasks`,
        {
          task_name: newName,
          task_description: newDescription,
        },
        {
          headers: {
            Authorization: `${token}`, // Coloque "Bearer" antes do token
          },
        }
      );

      // Atualiza o estado das tarefas com a nova tarefa retornada pelo servidor
      setTasks([...tasks, response.data]);

      // Limpa os campos do formulário após o envio
      setNewName("");
      setNewDescription("");
    } catch (error) {
      console.log(error.response.data.error); // Armazenar a mensagem de erro no estado
    }
  };

  const handleDelete = async (taskId) => {
    try {
      // Envia a nova tarefa para o servidor
      await axios.delete(`http://localhost:8000/tasks/${taskId}`, {
        headers: {
          Authorization: `${token}`, // Coloque "Bearer" antes do token
        },
      });

      // Atualiza o estado das tarefas com a nova tarefa retornada pelo servidor
      setTasks(tasks.filter((task) => task.task_id !== taskId));
    } catch (error) {
      console.log(error.response.data.error); // Armazenar a mensagem de erro no estado
    }
  };

  useEffect(() => {
    const fetchUserDetails = async (userId) => {
      try {
        const response = await axios.get(
          `http://localhost:8000/users/${userId}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error(error.response.data.error);
      }
    };

    const fetchUserTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/users/${userId}/tasks`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setTasks(response.data);
        console.log("aaaaaaaa", response.data);
      } catch (error) {
        console.error(error.response.data.error);
      }
    };
    fetchUserDetails(userId);
    fetchUserTasks();
  }, [token, userId]);

  return (
    <div className="main-tasks">
      <h1>Tarefas do Usuário</h1>
      <img className="listaico" src={lista} alt="" />
      <p className="p-logado">Logado em: {user.email}</p>
      <form action="">
        <label htmlFor="" className="label">
          Digite o nome da tarefa:
          <input
            id="tarefa"
            type="text"
            value={newName}
            className="input"
            onChange={(e) => setNewName(e.target.value)}
          />
        </label>
        <label htmlFor="" className="label">
          Digite a descrição da tarefa:
          <textarea
            id="tarefa2"
            maxLength={50}
            className="input"
            type="text"
            onChange={(e) => setNewDescription(e.target.value)}
            value={newDescription}
          />
        </label>
        <button
          className="add"
          type="submit"
          disabled={newDescription.length < 8 || newName.length < 5}
          onClick={handleSubmit}
        >
          Criar Tarefa
        </button>
      </form>
      <br /> <br />
      {tasks?.map((task) => (
        <div key={task.task_id}>
          {editingTask && editingTask.task_id === task.task_id ? (
            // Campos de edição
            <div>
              <input
                className="input"
                type="text"
                value={editingTask.task_name}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, task_name: e.target.value })
                }
              />
              <input
                className="input"
                type="text"
                value={editingTask.task_description}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    task_description: e.target.value,
                  })
                }
              />

              <button className="salvar" onClick={handleUpdate}>
                Salvar
              </button>
            </div>
          ) : (
            // Visualização padrão
            <TasksCard
              handleEdit={() => handleEdit(task.task_id)} // Adicione a função handleEdit
              handleDelete={() => handleDelete(task.task_id)}
              completed={task.task_completed}
              name={task.task_name}
              description={task.task_description}
            />
          )}
        </div>
      ))}
      <div className="voltar-container">
        <Link to="/">
          <button className="voltar">
            <img src={voltar} alt="" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Tasks;

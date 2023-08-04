import { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import "../styles/Tasks.css";
import TasksCard from "./TasksCard";
import lista from '../assets/lista.png'

const Tasks = () => {
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({});

  const token = localStorage.getItem("token");
  const decodedToken = jwt_decode(token);
  const userId = decodedToken.user_id;

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
      <img className="listaico"src={lista} alt="" />
      <p className="p-logado">Logado em: {user.email}</p>
      <form action="">
        <label htmlFor="" className="label">
          Digite o nome da tarefa:
          <input
            type="text"
            value={newName}
            className="input"
            onChange={(e) => setNewName(e.target.value)}
          />
        </label>
        <label htmlFor="" className="label">
          Digite a descrição da tarefa:
          <textarea
            maxLength={50}
            className="input"
            type="text"
            onChange={(e) => setNewDescription(e.target.value)}
            value={newDescription}
          />
        </label>
        <button className="add"type="submit" onClick={handleSubmit}>
          Criar Tarefa
        </button>
       
      </form>
      <br /> <br />
      {tasks?.map((task) => (
        <TasksCard
          key={task.task_id}
          handleDelete={() => handleDelete(task.task_id)}
          completed={task.task_completed}
          name={task.task_name}
          description={task.task_description}
        />
      ))}
    </div>
  );
};

export default Tasks;

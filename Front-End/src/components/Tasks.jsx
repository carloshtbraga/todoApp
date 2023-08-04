import { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({});

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const decodedToken = jwt_decode(token);
  const userId = decodedToken.user_id;

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
        console.log(response.data);
      } catch (error) {
        console.error(error.response.data.error);
      }
    };
    fetchUserDetails(userId);
    fetchUserTasks();
  }, [token, userId]); // Coloque o token como dependência do useEffect

  if (tasks.length === 0) {
    return <div>Theres no tasks</div>;
  }

  return (
    <div>
      <h1>Tarefas do Usuário Autenticado</h1>
      <h2>Logado em: {user.email}</h2>
      <ul>
        {tasks?.map((task) => (
          <div key={task.task_id}>
            <h3>{task.task_name}</h3>
            <p>{task.task_description}</p>
            <p>{task.task_completed ? "Concluída" : "Não concluída"}</p>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import todo from '../assets/todo.png'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [error, setError] = useState(""); // Estado para armazenar a mensagem de erro
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isCreatingUser ? "/auth/register" : "/auth/login";
      const response = await axios.post(`http://localhost:8000${endpoint}`, {
        email,
        password,
      });

      // Salvar o token JWT no armazenamento local ou em um cookie
      const token = response.data.token;
      localStorage.setItem("token", token);
      // Redirecionar o usuário para a página de tarefas
      isCreatingUser ? alert("Agora é só logar") : navigate("/tasks");
      setEmail("");
      setPassword("");
      setIsCreatingUser(false);
      setError(""); // Limpar a mensagem de erro em caso de sucesso
    } catch (error) {
      setError(error.response.data.error); // Armazenar a mensagem de erro no estado
    }
  };

  return (
    <div>
        <div className="main">
        <h1>todoApp</h1>
        <img className="todo"src={todo} alt="" />
        </div>
        <br /><br />
    <div className="login-container">
      <h2>{isCreatingUser ? "Criar Usuário" : "Login"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">
          {isCreatingUser ? "Criar Usuário" : "Login"}
        </button>
      </form>
      <br />
      <button className="button2"onClick={() => setIsCreatingUser(!isCreatingUser)}>
        {isCreatingUser
          ? "Já tem conta? Faça Login"
          : "Não tem conta? Crie uma"}
      </button>
      <br />
      {error && <p className="error">{error}</p>}
    </div>
    </div>
  );
};

export default Login;

// import { useEffect, useState } from "react";
import "./App.css";

import Rotas from "./Routes/Rotas";

function App() {
  // const [tasks, setTasks] = useState(null);

  // const getData = async () => {
  //   try {
  //     const result = await fetch("http://localhost:8000/tasks");
  //     const resultJson = await result.json();
  //     console.log(resultJson);
  //     setTasks(resultJson);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   getData();
  // }, []);

  return (
    <Rotas />
  );
}

export default App;

{
  /* {tasks?.map((task) => (
        <div key={task.id}>
          <h1>{task.task_name}</h1>
          <p>{task.task_description}</p>
          <p>{task.task_completed ? "Completed" : "Not Completed"}</p>
          <br />
        </div>
      ))} */
}

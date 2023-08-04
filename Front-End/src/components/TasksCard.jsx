/* eslint-disable react/prop-types */
import "../styles/TasksCard.css";
import deleteicon from "../assets/deleteicon.png"
import edit from "../assets/editicon.png"

export default function TasksCard({
  name,
  description,
  completed,
  handleDelete,
}) {
  return (
    <div className="main-card">
    <div className="each-task">
      <h2>{name}</h2>
      <p className="p-task">{description}</p>
      <p className="p-task">{completed ? "Concluída" : "Não concluída"}</p>
    </div>
    <div className="buttonsdiv">
      <button onClick={handleDelete} className="button-card"><img className="icons" src={deleteicon} alt="" /></button>
      <button className="button-card"><img className="icons" src={edit} alt="" /></button>
      </div>

    </div>
  );
}

import { TaskEditorContext } from "../context/TaskEditorContext";
import { useContext } from "react";

export default function Task({
  taskId,
  task,
  day,
  priority,
  finished,
  onUpdate,
  onEdit,
}) {
  const priorityColors = {
    lowPriority: "bg-green-500",
    mediumPriority: "bg-yellow-300",
    highPriority: "bg-red-600",
  };

  const token = localStorage.getItem("token");
  const { toggleTaskEditor } = useContext(TaskEditorContext);

  async function handleDelete(id) {
    try {
      const res = await fetch(`http://localhost:3000/tasks/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        await onUpdate();
      } else {
        console.error("Erro ao deletar tarefa");
      }
    } catch (error) {
      console.error("Erro na requisição de delete:", error);
    }
  }

  async function onFinish(id) {
    try {
      const res = await fetch(`http://localhost:3000/tasks/finish/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        await onUpdate();
      } else {
        console.error("Erro ao atualizar status da tarefa");
      }
    } catch (error) {
      console.error("Erro na requisição de update:", error);
    }
  }

  function handleEdit(id) {
    onEdit(id);
    toggleTaskEditor();
  }

  return (
    <div className="bg-[#111111]/50 h-16 w-[95%] p-2 my-1 rounded-md flex justify-between items-center">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div
          className={`h-5 w-5 shrink-0 ${priorityColors[priority]} rounded-full`}
        ></div>
        <div className="taskName flex-1 min-w-0 max-h-12 overflow-y-auto break-all pr-1 scrollbar-thin">
          <p
            className={`${
              finished ? "text-green-400 italic line-through" : "text-white"
            } text-sm leading-tight`}
          >
            {task}
          </p>
        </div>
      </div>

      <div className="flex gap-2 items-center shrink-0 self-stretch ml-auto">
        <hr className="border-none w-0.5 bg-white my-0.5 h-[80%]" />
        <p className="text-white text-sm">{day}</p>

        <div
          onClick={() => onFinish(taskId)}
          className="bi bi-check2 text-white text-[25px] flex justify-center items-center h-7 w-7 bg-[#111111] rounded cursor-pointer"
        ></div>

        <div
          onClick={() => handleEdit(taskId)}
          className="bi bi-pencil-fill text-white text-[17px] flex justify-center items-center h-7 w-7 bg-[#111111] rounded cursor-pointer"
        ></div>

        <div
          onClick={() => handleDelete(taskId)}
          className="bi bi-trash-fill text-white text-[18px] flex justify-center items-center h-7 w-7 bg-[#111111] rounded cursor-pointer"
        ></div>
      </div>
    </div>
  );
}

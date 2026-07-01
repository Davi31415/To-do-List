import { TaskMenuContext } from "../context/TaskMenuContext";
import { ThemeContext } from "../context/ThemeContext";
import { TasksContext } from "../context/TasksContext";

import { useContext } from "react";
import { useState } from "react";

export default function Taskmenu({ taskName, onUpdate }) {
  const { open, toggleMenu } = useContext(TaskMenuContext);
  const { currentTheme } = useContext(ThemeContext);

  const [priority, setPriority] = useState("");
  const [date, setDate] = useState("");
  const { taskList, setTaskList } = useContext(TasksContext);

  const taskId = crypto.randomUUID();

  async function addTask() {
    if (priority === "" || date === "") {
      alert("Não pode ter campos vazios!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Sessão expirada. Faça login novamente.");
      return;
    }

    if (taskName.length > 255) {
      alert("O nome da tarefa excedeu o limite de 255 caracteres.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskId: taskId,
          task: taskName,
          priority: priority,
          day: date,
          finished: false,
        }),
      });

      if (!response.ok) throw new Error("Erro ao salvar tarefa no servidor");

      onUpdate();

      const newTask = {
        taskId: taskId,
        task: taskName,
        priority: priority,
        day: date,
        finished: false,
      };

      setTaskList([newTask, ...taskList]);

      setPriority("");
      setDate("");
      toggleMenu();
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      alert("Não foi possível salvar a tarefa no momento.");
    }
  }

  return (
    <div
      className={`bg-[#212529]/70 w-screen h-screen ${open ? "flex justify-center items-center" : "hidden"} absolute top-0`}
    >
      <div
        className={`h-54 w-120 ${open ? "flex flex-col items-center" : "hidden"} shadow-[0_5px_15px_rgba(0,0,0,0.35)] rounded-2xl`}
        style={{ background: currentTheme.background }}
      >
        <div className="flex flex-row items-center relative w-full  mt-2">
          <h1
            className="text-center text-2xl w-full p-2"
            style={{ color: currentTheme.typography.primary }}
          >
            Adicionar{" "}
            <span
              className="underline underline-offset-4"
              style={{ textDecorationColor: currentTheme.typography.highlight }}
            >
              tarefa
            </span>
          </h1>
          <i
            onClick={toggleMenu}
            className="bi bi-x text-4xl absolute right-0 top- px-2 cursor-pointer"
            style={{ color: currentTheme.typography.primary }}
          ></i>
        </div>
        <div className="flex flex-row justify-between w-[90%] mt-2">
          <div className="text-white ">
            <div className="flex flex-col">
              <label
                className="text-xs uppercase tracking-wider ml-1 mb-1"
                style={{ color: currentTheme.typography.primary }}
              >
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="bg-[#111111]/50 p-2 rounded outline-none"
              >
                <option value="" selected disabled>
                  Nenhuma opção
                </option>
                <option value="lowPriority">Prioridade Baixa</option>
                <option value="mediumPriority">Prioridade Média</option>
                <option value="highPriority">Prioridade Alta</option>
              </select>
            </div>
          </div>
          <div className="text-white">
            <div className="flex flex-col">
              <label
                className="text-xs uppercase tracking-wider ml-1 mb-1"
                style={{ color: currentTheme.typography.primary }}
              >
                Data da tarefa
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="scheme-dark text-white bg-[#111111]/50 p-2 rounded outline-none"
              />
            </div>
          </div>
        </div>
        <button
          onClick={() =>
            addTask({
              task: taskName,
              priority: priority,
              day: date,
              taskId: taskId,
              finished: false,
            })
          }
          className="w-70 px-1.5 py-2 my-7 rounded text-black cursor-pointer"
          style={{ backgroundColor: currentTheme.typography.highlight }}
        >
          Criar tarefa!
        </button>
      </div>
    </div>
  );
}

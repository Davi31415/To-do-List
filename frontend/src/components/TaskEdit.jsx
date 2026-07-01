import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";

import { TasksContext } from "../context/TasksContext";
import { TaskEditorContext } from "../context/TaskEditorContext";
import { ThemeContext } from "../context/ThemeContext";

export default function Taskmenu({ taskId, onUpdate }) {
  const { openTaskEditor, toggleTaskEditor } = useContext(TaskEditorContext);
  const { currentTheme } = useContext(ThemeContext);
  const { typography, background: bgColor } = currentTheme;

  const [inputValue, setInputValue] = useState("");
  const [priority, setPriority] = useState("");
  const [date, setDate] = useState("");

  async function editTask() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para editar tarefas.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/tasks/update/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            task: inputValue,
            priority: priority,
            day: date,
          }),
        },
      );

      if (!response.ok)
        throw new Error("Erro ao atualizar a tarefa no servidor");

      await onUpdate();
      toggleTaskEditor();
    } catch (error) {
      console.error("Erro na edição:", error);
      alert("Não foi possível salvar a edição. Tente novamente.");
    }
  }

  return (
    <div
      className={`bg-[#212529]/70 w-screen h-screen ${openTaskEditor ? "flex justify-center items-center" : "hidden"} absolute top-0`}
    >
      <div
        className={`h-70 w-120 ${openTaskEditor ? "flex flex-col items-center" : "hidden"} shadow-[0_5px_15px_rgba(0,0,0,0.35)] rounded-2xl`}
        style={{ background: bgColor }}
      >
        <div className="flex flex-row items-center relative w-full mt-2">
          <h1
            className="text-center text-2xl w-full p-2"
            style={{ color: typography.primary }}
          >
            Editar{" "}
            <span
              className="underline underline-offset-4"
              style={{ textDecorationColor: typography.highlight }}
            >
              tarefa
            </span>
          </h1>
          <i
            onClick={toggleTaskEditor}
            className="bi bi-x text-4xl absolute right-0 top- px-2 cursor-pointer"
            style={{ color: typography.primary }}
          ></i>
        </div>

        <div className="text-left w-[90%]">
          <label
            className="text-xs uppercase tracking-wider ml-1 mb-1"
            style={{ color: typography.primary }}
          >
            Novo nome da tarefa
          </label>
          <input
            type="text"
            className="bg-[#111111]/50 text-white p-2 rounded outline-none w-full my-1"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>

        <div className="flex flex-row justify-between w-[90%] mt-2">
          <div className="text-white animate-none">
            <div className="flex flex-col">
              <label
                className="text-xs uppercase tracking-wider ml-1 mb-1"
                style={{ color: typography.primary }}
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
                style={{ color: typography.primary }}
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
          onClick={() => editTask()}
          className="w-70 px-1.5 py-2 my-7 rounded text-black cursor-pointer"
          style={{ backgroundColor: typography.highlight }}
        >
          Salvar!
        </button>
      </div>
    </div>
  );
}

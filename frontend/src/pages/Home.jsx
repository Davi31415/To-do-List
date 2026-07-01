import { useContext, useState, useEffect } from "react";

import Task from "../components/Task";
import Taskmenu from "../components/TaskMenu";
import TaskEdit from "../components/TaskEdit";
import TaskFilter from "../components/TaskFilter";

import { TaskMenuContext } from "../context/TaskMenuContext";
import { TasksContext } from "../context/TasksContext";
import { ThemeContext } from "../context/ThemeContext";
import { FilterContext } from "../context/FilterContext";

import { formattedDate } from "../utils/date";

export default function Home() {
  const { toggleMenu } = useContext(TaskMenuContext);
  const { theme, toggleTheme, currentTheme } = useContext(ThemeContext);
  const { activePriorities, activeDate, toggleTaskFilter, hasFilter } =
    useContext(FilterContext);

  const { typography, ui, background: bgColor } = currentTheme;

  const [inputValue, setInputValue] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [dbTasks, setDbTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const emptyInputAlert = () => alert("O nome da tarefa não pode ser vazio!");
  async function fetchTasks() {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    if (activeDate) {
      console.log("Active Date:", activeDate);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priorities: activePriorities,
          date: activeDate,
        }),
      });

      if (!response.ok) throw new Error("Falha na autenticação");
      const data = await response.json();

      const tasksFormatadas = data.map((task) => ({
        ...task,
        data_tarefa: task.data_tarefa ? task.data_tarefa.split("T")[0] : "",
      }));

      const finishedTasks = tasksFormatadas.filter(
        (task) => task.finalizado === 1,
      );
      const unfinishedTasks = tasksFormatadas.filter(
        (task) => task.finalizado === 0,
      );
      const sortedTasks = [...unfinishedTasks, ...finishedTasks];

      setDbTasks(sortedTasks);
    } catch (err) {
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [activePriorities, activeDate]);

  function loadTasks() {
    let tasksToRender = [...dbTasks];

    if (searchInputValue.trim() !== "") {
      tasksToRender = tasksToRender.filter((el) =>
        el.nome.toLowerCase().includes(searchInputValue.toLowerCase()),
      );
    }

    if (tasksToRender.length === 0) {
      return (
        <div className="h-full mb-13 flex justify-center items-center transition-colors duration-100">
          <h1 className="italic" style={{ color: typography.secondary }}>
            Nenhuma tarefa encontrada
          </h1>
        </div>
      );
    }

    return tasksToRender.map((el) => (
      <Task
        key={el.taskId}
        task={el.nome}
        day={el.data_tarefa}
        priority={el.prioridade}
        taskId={el.taskId}
        finished={el.finalizado}
        onUpdate={fetchTasks}
        onEdit={(id) => setEditingTaskId(id)}
      />
    ));
  }

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim() === "") {
        emptyInputAlert();
      } else {
        toggleMenu();
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const renderedTasks = loadTasks();

  return (
    <div className="min-h-dvh relative" style={{ background: bgColor }}>
      <div className="p-2 flex justify-between">
        <div>
          <p
            className="text-[21px] transition-colors duration-100"
            style={{ color: typography.primary }}
          >
            Seja <span style={{ color: typography.highlight }}>Bem-vindo!</span>
          </p>
          <p
            className="text-[16px] transition-colors duration-100"
            style={{ color: typography.primary }}
          >
            {formattedDate}
          </p>
        </div>
        <div className="flex flex-row items-center gap-4 w-fit">
          <i
            onClick={toggleTheme}
            className={`sun px-1.5 rounded-[5px] cursor-pointer text-[32px] hover:bg-(--icon-hover) transition-colors duration-300 ease-in-out ${
              theme === "dark" ? "bi bi-brightness-high" : "bi bi-moon"
            }`}
            style={{
              color: ui.icons,
              "--icon-hover": ui.iconsHover,
            }}
          ></i>
          <i
            className="bi bi-box-arrow-right px-1.5 rounded-[5px] cursor-pointer text-[32px] hover:bg-(--icon-hover) transition-colors duration-300 ease-in-out"
            style={{
              color: ui.icons,
              "--icon-hover": ui.iconsHover,
            }}
            onClick={logout}
          ></i>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <h1
          className="text-[60px] sm:text-[75px] md:text-[95px] text-center transition-colors duration-100"
          style={{ color: typography.primary }}
        >
          To-do List
        </h1>
        <div
          className="taskInputField flex w-[90%] md:w-[60%] h-13 mb-2 items-center bg-white hover:shadow-[0px_0px_90px_var(--input-glow)] rounded-full px-2 py-3 shadow-[0px_0px_0px_0px_rgba(255,196,0,0)] transition-[box-shadow,color,background-color] duration-200 ease-in-out"
          style={{
            background: ui.input,
            "--input-glow": typography.highlight,
          }}
        >
          <input
            type="text"
            placeholder="Escreva a sua tarefa"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleEnterPress}
            className="flex-1 w-full placeholder:text-(--placeholder-color) placeholder:text-[14px] outline-none transition-shadow duration-200 ease-in-out px-2.5 py-5"
            style={{
              color: typography.secondary,
              "--placeholder-color": typography.secondary,
            }}
          />
          <button
            onClick={inputValue.trim() === "" ? emptyInputAlert : toggleMenu}
            className="ml-3 w-10 h-10 rounded-full bg-[#111111] cursor-pointer text-white text-xl flex items-center justify-center"
          >
            <i className="bi bi-plus-lg text-2xl"></i>
          </button>
        </div>

        <div className="flex items-center flex-col h-90 w-[90%] md:w-[60%] rounded-2xl bg-[#212529]/50">
          <div className="flex justify-between w-[95%] py-3">
            <div className="relative w-43 flex items-center">
              <i className="bi bi-search absolute left-0 text-white pb-1"></i>
              <input
                type="text"
                placeholder="Pesquise sua tarefa"
                className="w-full pl-6 bg-transparent border-b-2 border-white text-white placeholder-white placeholder:text-[14px] outline-none"
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
              />
            </div>
            <i
              onClick={toggleTaskFilter}
              className="bi bi-filter text-3xl text-white cursor-pointer"
            ></i>
          </div>

          <div className="h-full taskArea flex items-center flex-col w-full overflow-y-scroll">
            {renderedTasks}
          </div>
        </div>
      </div>
      <TaskEdit taskId={editingTaskId} onUpdate={fetchTasks} />
      <Taskmenu taskName={inputValue} onUpdate={fetchTasks} />
      <TaskFilter onUpdate={fetchTasks} />
    </div>
  );
}

import { useContext, useState, useEffect } from "react";

import { FilterContext } from "../context/FilterContext";
import { ThemeContext } from "../context/ThemeContext";

export default function TaskFilter() {
  const {
    activePriorities,
    setActivePriorities,
    activeDate,
    setActiveDate,
    openTaskFilter,
    toggleTaskFilter,
  } = useContext(FilterContext);

  const { currentTheme } = useContext(ThemeContext);
  const { typography, background: bgColor } = currentTheme;

  const [low, setLow] = useState(true);
  const [medium, setMedium] = useState(true);
  const [high, setHigh] = useState(true);

  useEffect(() => {
    const priorities = [];

    if (low) priorities.push("lowPriority");
    if (medium) priorities.push("mediumPriority");
    if (high) priorities.push("highPriority");

    setActivePriorities(priorities);
  }, [low, medium, high]);

  function resetFilters() {
    setLow(true);
    setMedium(true);
    setHigh(true);
    setActiveDate("");
    toggleTaskFilter();
  }

  return (
    <div
      className={`bg-[#212529]/70 w-screen h-screen ${openTaskFilter ? "flex justify-center items-center" : "hidden"} absolute top-0`}
    >
      <div
        className={`h-90 w-90 ${openTaskFilter ? "flex flex-col items-center" : "hidden"} shadow-[0_5px_15px_rgba(0,0,0,0.35)] rounded-2xl`}
        style={{ background: bgColor }}
      >
        <div className="flex flex-row items-center relative w-full mt-2">
          <h1
            className="text-center text-2xl w-full p-2"
            style={{ color: typography.primary }}
          >
            Filtrar{" "}
            <span
              className="underline underline-offset-4"
              style={{ textDecorationColor: typography.highlight }}
            >
              tarefas
            </span>
          </h1>
          <i
            onClick={toggleTaskFilter}
            className="bi bi-x text-4xl absolute right-0 top- px-2 cursor-pointer"
            style={{ color: typography.primary }}
          ></i>
        </div>

        <div className="flex flex-col items-center gap-2 justify-between w-[90%] text-white">
          <label
            className="text-xs uppercase tracking-wider mt-1"
            style={{ color: typography.primary }}
          >
            Prioridade da tarefa
          </label>

          <div className="flex flex-col items-start gap-2 w-fit">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="priority"
                value="lowPriority"
                id="lowPriority"
                className="w-3.5 h-3.5"
                checked={low}
                onChange={(el) => setLow(el.target.checked)}
              />
              <label
                htmlFor="lowPriority"
                className="text-sm"
                style={{ color: typography.primary }}
              >
                Baixa prioridade
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="priority"
                value="mediumPriority"
                id="mediumPriority"
                className="w-3.5 h-3.5"
                checked={medium}
                onChange={(el) => setMedium(el.target.checked)}
              />
              <label
                htmlFor="mediumPriority"
                className="text-sm"
                style={{ color: typography.primary }}
              >
                Média prioridade
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="priority"
                value="highPriority"
                id="highPriority"
                className="w-3.5 h-3.5"
                checked={high}
                onChange={(el) => setHigh(el.target.checked)}
              />
              <label
                htmlFor="highPriority"
                className="text-sm"
                style={{ color: typography.primary }}
              >
                Alta prioridade
              </label>
            </div>
          </div>

          <label
            className="text-xs uppercase tracking-wider mt-1"
            style={{ color: typography.primary }}
          >
            Data da tarefa
          </label>
          <input
            type="date"
            className="scheme-dark text-white bg-[#111111]/50 p-2 rounded outline-none"
            value={activeDate}
            onChange={(e) => setActiveDate(e.target.value)}
          />
        </div>

        <button
          onClick={toggleTaskFilter}
          className="w-70 px-1.5 py-2 mt-4 mb-2 rounded text-black cursor-pointer"
          style={{ backgroundColor: typography.highlight }}
        >
          Filtrar
        </button>

        <button
          onClick={resetFilters}
          className="bg-[#ff4040] w-70 px-1.5 py-2 rounded text-white cursor-pointer"
        >
          Resetar filtros
        </button>
      </div>
    </div>
  );
}

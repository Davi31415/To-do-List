import { createContext, useState } from "react";

export const FilterContext = createContext();

export function TaskFilterProvider({ children }) {
  const [activePriorities, setActivePriorities] = useState([
    "lowPriority",
    "mediumPriority",
    "highPriority",
  ]);
  const [activeDate, setActiveDate] = useState("");
  const hasFilter = activeDate !== "" || activePriorities.length < 3;

  const [openTaskFilter, setOpenTaskFilter] = useState(false);
  const toggleTaskFilter = () => {
    setOpenTaskFilter(!openTaskFilter);
    console.log(activePriorities);
  };

  return (
    <FilterContext.Provider
      value={{
        activePriorities,
        setActivePriorities,
        activeDate,
        setActiveDate,
        openTaskFilter,
        toggleTaskFilter,
        hasFilter,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

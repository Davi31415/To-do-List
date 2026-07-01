import { createContext, useState } from "react";

export const TasksContext = createContext();

export function TasksContextProvider({ children }) {
  const [taskList, setTaskList] = useState([]);
  const [taskId, setTaskId] = useState(1);
  const [editingTaskId, setEditingTaskId] = useState(null);

  return (
    <TasksContext.Provider
      value={{
        taskList,
        setTaskList,
        taskId,
        setTaskId,
        editingTaskId,
        setEditingTaskId,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

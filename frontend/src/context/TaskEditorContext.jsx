import { createContext, useState } from "react";

export const TaskEditorContext = createContext();

export function TaskEditorProvider({ children }) {
  const [openTaskEditor, setOpenTaskEditor] = useState(false);
  const toggleTaskEditor = () => setOpenTaskEditor(!openTaskEditor);

  return (
    <TaskEditorContext.Provider
      value={{ openTaskEditor, setOpenTaskEditor, toggleTaskEditor }}
    >
      {children}
    </TaskEditorContext.Provider>
  );
}

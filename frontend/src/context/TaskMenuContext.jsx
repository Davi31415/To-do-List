import { createContext, useState } from "react";

export const TaskMenuContext = createContext();

export function TaskMenuProvider({ children }) {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!open);

  return (
    <TaskMenuContext.Provider value={{ open, setOpen, toggleMenu }}>
      {children}
    </TaskMenuContext.Provider>
  );
}

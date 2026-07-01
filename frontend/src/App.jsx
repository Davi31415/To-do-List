import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { TaskMenuProvider } from "./context/TaskMenuContext.jsx";
import { TasksContextProvider } from "./context/TasksContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { TaskEditorProvider } from "./context/TaskEditorContext.jsx";
import { TaskFilterProvider } from "./context/FilterContext.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";

import publicRoute from "./routes/PublicRoute.jsx";
import privateRoute from "./routes/PrivateRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: publicRoute({ children: <Login /> }),
  },
  {
    path: "/home",
    element: privateRoute({ children: <Home /> }),
  },
]);

function App() {
  return (
    <ThemeProvider>
      <TaskEditorProvider>
        <TasksContextProvider>
          <TaskFilterProvider>
            <TaskMenuProvider>
              <RouterProvider router={router} />
            </TaskMenuProvider>
          </TaskFilterProvider>
        </TasksContextProvider>
      </TaskEditorProvider>
    </ThemeProvider>
  );
}

export default App;

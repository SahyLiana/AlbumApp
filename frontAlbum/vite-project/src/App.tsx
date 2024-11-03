import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import LogRegLayout from "./layouts/LogRegLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Auth from "./auth/Auth";

function App() {
  const myRouter = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route element={<LogRegLayout />}>
          <Route element={<Login />} path="login" />
          <Route element={<Register />} path="register" />
        </Route>

        <Route element={<Auth />} path="/">
          <Route element={<Dashboard />} index />
        </Route>
      </>
    )
  );

  return (
    <div>
      <RouterProvider router={myRouter} />
    </div>
  );
}

export default App;

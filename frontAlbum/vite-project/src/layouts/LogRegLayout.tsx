import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

function LogRegLayout() {
  const location = useLocation();

  const [pathname, setPathname] = useState("/");

  useEffect(() => {
    // console.log(location.pathname);
    setPathname(location.pathname);
  }, [location.pathname]);

  return (
    <div className="h-screen bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
      <div className="bg-white w-1/3 h-2/3 p-6 rounded-lg shadow-lg">
        <h1 className="font-bold text-3xl text-center mb-8">
          {pathname === "/login" ? "Login Form" : "Register Form"}
        </h1>
        <div className="flex w-full mb-8">
          <NavLink
            className="basis-1/2 p-3 text-center font-bold border-b-[1px] border-pink-600 "
            style={({ isActive }) =>
              isActive
                ? { color: "white", backgroundColor: " rgb(219 39 119)" }
                : { backgroundColor: "white", color: "rgb(219 39 119)" }
            }
            to={"/login"}
          >
            Login
          </NavLink>
          <NavLink
            className="basis-1/2 p-3 text-center font-bold border-b-[1px] border-pink-600 "
            style={({ isActive }) =>
              isActive
                ? { color: "white", backgroundColor: " rgb(219 39 119)" }
                : { backgroundColor: "white", color: "rgb(219 39 119)" }
            }
            to={"/register"}
          >
            Register
          </NavLink>
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default LogRegLayout;

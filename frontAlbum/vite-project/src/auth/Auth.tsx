import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import userStore from "../store/userStore";

function Auth() {
  const navigate = useNavigate();
  const { setUser } = userStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDashboard = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log(token);

      try {
        const getUser = await axios.get(
          "http://localhost:3000/user/dashboard",
          {
            headers: {
              Authorization: token,
            },
          }
        );

        console.log("Getuser", getUser.data._doc);
        setUser(getUser.data._doc);
      } catch (error) {
        console.log(error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    getDashboard();
  }, []);

  return loading ? <p>Loading</p> : <Outlet />;
}

export default Auth;

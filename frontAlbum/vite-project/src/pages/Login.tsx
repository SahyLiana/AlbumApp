import { useState } from "react";
import { useSnackbar } from "notistack";
import userStore from "../store/userStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

type UserType = {
  username: string;
  password: string;
};

function Login() {
  const [userData, setUserData] = useState<UserType>({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const { loginStore } = userStore();

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = await loginStore(userData);
      console.log("Token", token);
      localStorage.setItem("token", `Bearer ${token}`);
      enqueueSnackbar("Logged in successfully", {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      enqueueSnackbar("Invalid credentials", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    }
  };

  return (
    <motion.form
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.5 }}
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <input
        className="border-2 py-1 text-lg rounded-md px-4"
        type="text"
        name="username"
        onChange={handleChange}
        placeholder="Enter your username"
        required
      />
      <input
        className="border-2 py-1 text-lg rounded-md px-4"
        type="password"
        name="password"
        onChange={handleChange}
        placeholder="Enter your password"
        required
      />
      <button className="bg-green-500 text-white text-lg font-bold py-2 rounded-sm hover:bg-green-600 duration-200 transition-all">
        Submit
      </button>
    </motion.form>
  );
}

export default Login;

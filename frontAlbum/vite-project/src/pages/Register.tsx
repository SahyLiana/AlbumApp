import { useState } from "react";
import { useSnackbar } from "notistack";
import userStore from "../store/userStore";
import { motion } from "framer-motion";

type UserType = {
  username: string;
  confirm: string;
  password: string;
};

function Register() {
  const [userData, setUserData] = useState<UserType>({
    username: "",
    confirm: "",
    password: "",
  });

  const { registerStore } = userStore();

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
    console.log(userData);

    if (
      userData.confirm.length < 3 ||
      userData.password.length < 3 ||
      userData.username.length < 3
    ) {
      enqueueSnackbar(
        "Username,password,confirm must be more than 3 characters",
        {
          variant: "error",
          anchorOrigin: { horizontal: "right", vertical: "bottom" },
        }
      );
      return;
    } else {
      if (userData.password !== userData.confirm) {
        enqueueSnackbar("Password mismatched", {
          variant: "error",
          anchorOrigin: { horizontal: "right", vertical: "bottom" },
        });
      } else {
        try {
          await registerStore(userData);
          enqueueSnackbar("Registered  successfully", {
            variant: "success",
            anchorOrigin: { horizontal: "right", vertical: "bottom" },
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.log(error);
          enqueueSnackbar(error.response.data.message, {
            variant: "error",
            anchorOrigin: { horizontal: "right", vertical: "bottom" },
          });
        }
      }
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
        placeholder="Enter your user name"
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
      <input
        className="border-2 py-1 text-lg rounded-md px-4"
        type="password"
        name="confirm"
        onChange={handleChange}
        placeholder="Confirm your password"
        required
      />
      <button className="bg-green-500 text-white text-lg font-bold py-2 rounded-sm hover:bg-green-600 duration-200 transition-all">
        Submit
      </button>
    </motion.form>
  );
}

export default Register;

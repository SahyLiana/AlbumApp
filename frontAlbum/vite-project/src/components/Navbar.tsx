import { useNavigate } from "react-router-dom";
import userStore from "../store/userStore";
import Modal from "react-modal";
import { useSnackbar } from "notistack";
import "./Overlay.css";
import { useState } from "react";
import { motion } from "framer-motion";
import { IoIosLogOut } from "react-icons/io";

Modal.setAppElement("#root");
function Navbar() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, createAlbumStore, albums } = userStore();
  const { enqueueSnackbar } = useSnackbar();

  const [albumName, setAlbumName] = useState("");
  const [albumImg, setAlbumImg] = useState<File | undefined>();

  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files as FileList;

    setAlbumImg(selectedFiles?.[0]);
  };

  const handleCreateAlbum = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log("create album", albumName, albumImg);

    try {
      await createAlbumStore(
        albumImg,
        { name: albumName, belongsTo: user?._id },
        token
      );
      enqueueSnackbar("Profile image uploaded", {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });

      console.log("My new albums are:", albums);

      closeModal();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    }
  };

  return (
    <div className="sticky top-0 w-[15%] shadow-pink-300 shadow-xl bg-pink-100 h-screen">
      <div className="py-10 px-6">
        <motion.h1
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 },
          }}
          className="text-center  text-pink-700 font-semibold text-4xl"
        >
          AlbumApp
        </motion.h1>
        <div className="h-[1px] w-full bg-pink-700"></div>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 },
          }}
          className="mt-6 text-3xl font-thin italic"
        >
          Welcome {user?.username}
        </motion.h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          className="flex flex-col gap-2 mt-4"
        >
          <button
            onClick={openModal}
            className="bg-green-600  text-white p-2 rounded-lg duration-500 transition-all hover:scale-x-110 hover:bg-green-700"
          >
            Add album +
          </button>
          <button
            className="bg-red-600 flex items-center justify-center gap-2 text-white p-2 rounded-lg duration-500 hover:scale-x-110 transition-all hover:bg-red-700"
            onClick={logOut}
          >
            Log out <IoIosLogOut className="text-lg" />
          </button>
        </motion.div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          overlayClassName="Overlay"
          className="top-[50%]  fixed left-[50%] bg-white right-auto w-1/2 border-[1px] p-4 rounded-lg shadow-lg bottom-auto m-r-[-50%] translate-x-[-50%] translate-y-[-50%] h-[70%]"
        >
          <motion.h1
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5 }}
            variants={{
              hidden: { opacity: 0.5, x: -10 },
              visible: { opacity: 1, x: 0 },
            }}
            className="text-3xl mb-2 font-semibold text-pink-600"
          >
            Add new Album
          </motion.h1>
          <div className="h-[1px] bg-pink-600 w-full"></div>

          <motion.form
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5 }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            onSubmit={handleCreateAlbum}
            className="mt-4"
          >
            <label className="text-lg">Album name:</label>
            <br />
            <input
              className="border-2 mb-2 rounded-md w-[50%]  px-1 py-2 text-lg"
              type="text"
              name="name"
              onChange={(e) => setAlbumName(e.target.value)}
              required
              placeholder="Enter album name..."
            />
            <br />
            <input
              onChange={handleChangeImage}
              type="file"
              name="albumImg"
              required
            />
            <br />
            <button className="bg-blue-600 transition-all mt-3 font-bold px-5 py-1 hover:bg-blue-700 duration-200 rounded-md text-white ">
              Add +
            </button>
          </motion.form>
        </Modal>
      </div>
    </div>
  );
}

export default Navbar;

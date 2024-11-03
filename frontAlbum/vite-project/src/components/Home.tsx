import { useState } from "react";
import BgImg from "../assets/darkbgimg.png";
import ProfileImg from "../assets/profileimg.png";
import { useSnackbar } from "notistack";
import Modal from "react-modal";
import userStore from "../store/userStore";
import "./Card.css";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

// import { EffectCards } from "swiper/modules";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
// import axios from "axios";

type Album = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  albumImg: File | any;
  name: string;
  _id: string;
  belongsTo: string;
  photos?: string[];
};

Modal.setAppElement("#root");
function Home() {
  const [bgModalIsOpen, setBgModalIsOpen] = useState(false);
  const [editAlbumIsOpen, setEditAlbumIsOpen] = useState(false);
  const [profileModalIsOpen, setProfileModalIsOpen] = useState(false);
  const [photosIsOpen, setPhotosIsOpen] = useState(false);
  const [singlePhotoIsOpen, setSinglePhotoIsOpen] = useState(false);
  const [photo, setPhoto] = useState("");
  const [Image, setImage] = useState<File | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [albumName, setAlbumName] = useState("");

  const {
    uploadBgImgStore,
    user,
    editModalAlbumStore,
    deleteAlbumService,
    albums,
    uploadProfileImgStore,
    album,
    setAlbum,
    addPhotoStore,
    removePhotoStore,
  } = userStore();

  function openBgModal() {
    setBgModalIsOpen(true);
  }

  function closeModal() {
    setBgModalIsOpen(false);
    setProfileModalIsOpen(false);
    setEditAlbumIsOpen(false);

    setPhotosIsOpen(false);
    setImage(null);
  }

  function openProfileModal() {
    setProfileModalIsOpen(true);
  }

  function closeSinglePhoto() {
    setSinglePhotoIsOpen(false);
    setPhoto("");
  }

  function openPhotosModal(album: Album) {
    setPhotosIsOpen(true);
    setAlbum(album);
    console.log("PhotosModal", album);
  }

  function openEditModal(
    editAlbum: Album,
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.stopPropagation();
    setEditAlbumIsOpen(true);
    setAlbumName(editAlbum.name);
    console.log("Edit albumId", editAlbum);
    setAlbum(editAlbum);
    console.log("My album is", album);
  }

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFIles = e.target.files as FileList;

    setImage(selectedFIles?.[0]);
  };

  const handleSubmitBgImg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(Image);

    const token = localStorage.getItem("token");
    console.log("TOken", token, user?._id);
    try {
      await uploadBgImgStore(Image, user?._id, token, user?.bgImg);
      enqueueSnackbar("Background image uploaded", {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitProfileImg = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    console.log(Image);

    const token = localStorage.getItem("token");
    console.log("TOken", token, user?._id);
    try {
      await uploadProfileImgStore(Image, user?._id, token, user?.profileImg);
      enqueueSnackbar("Profile image uploaded", {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
      closeModal();
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Upload failed", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    }
  };

  const handleSubmitEditAlbum = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Edit album", albumName, Image, album?.albumImg);

    if (!albumName && !Image) {
      enqueueSnackbar("Album name or image should not be empty", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    } else {
      const token = localStorage.getItem("token");
      try {
        const newAlbum = await editModalAlbumStore(
          album?._id,
          {
            name: albumName,
            albumImg: Image,
            belongsTo: user?._id,
            currentAlbumImg: album?.albumImg,
          },
          token
        );
        setAlbum(newAlbum);
        enqueueSnackbar("Updated successfuly", {
          variant: "success",
          anchorOrigin: { horizontal: "right", vertical: "bottom" },
        });
        closeModal();
      } catch (error) {
        console.log(error);
        enqueueSnackbar("Something went wrong...", {
          variant: "error",
          anchorOrigin: { horizontal: "right", vertical: "bottom" },
        });
      }
    }
  };

  const deleteAlbum = async (
    id: string,
    user_id: string | undefined,
    e: React.FormEvent<HTMLFormElement>,
    albumImg: File | null
  ) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    try {
      await deleteAlbumService(id, user_id, token, albumImg);
      enqueueSnackbar("Deleted successuly", {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Delete failed", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    }
  };

  const displayAlbum = () => {
    return albums.map((album, index) => (
      <motion.div
        key={album.name}
        onClick={() => openPhotosModal(album)}
        variants={albumsVariants}
        initial="initial"
        whileInView={"animate"}
        viewport={{
          once: true,
        }}
        custom={index}
        className="basis-[23%] hover:shadow-sm shadow-lg hover:shadow-pink-600  overflow-hidden card relative"
      >
        <img
          className="h-[350px] w-full transition-all duration-500"
          src={`http://localhost:3000/uploads/${album.albumImg}`}
        />
        <div
          style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
          className="flex justify-between items-center py-2 px-1   absolute bottom-0   w-full"
        >
          <p className="text-pink-600 text-lg ">{album.name}</p>
          <div className="text-[0.8rem] flex items-center text-white">
            <button
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={(e: any) => openEditModal(album, e)}
              className="mr-1    bg-green-900  hover:bg-green-700 rounded-sm p-1"
            >
              <CiEdit className="text-lg" />
            </button>
            <button
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={(e: any) =>
                deleteAlbum(album._id, user?._id, e, album.albumImg)
              }
              className="mr-1 bg-red-900 hover:bg-red-700 rounded-sm p-1"
            >
              <MdDelete className="text-lg" />
            </button>
          </div>
        </div>
      </motion.div>
    ));
  };

  const removePhoto = async (photo: string, albumId: string | undefined) => {
    console.log("RemovePhoto", photo, albumId);
    const token = localStorage.getItem("token");
    try {
      await removePhotoStore(photo, albumId, token);
      enqueueSnackbar("Photo deleted successuly", {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Deletion failed", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    }
  };

  const displaySinglePhoto = (
    e: React.FormEvent<HTMLFormElement>,
    photo: string
  ) => {
    e.stopPropagation();
    setSinglePhotoIsOpen(true);
    console.log("Photo", photo);
    setPhoto(photo);
  };

  const displayPhotos = (album: Album | null) => {
    return album?.photos?.map((photo) => (
      <SwiperSlide className="basis-[35%]">
        <img
          className="h-[300px] relative w-full rounded-xl shadow-inner shadow-purple-700 object-cover"
          src={`http://localhost:3000/uploads/${photo}`}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick={(e: any) => displaySinglePhoto(e, photo)}
        />
        <button
          onClick={() => removePhoto(photo, album._id)}
          className="bg-slate-500   hover:bg-opacity-100 bg-opacity-20 z-50 cursor-pointer hover:scale-110 duration-500 font-bold text-sm p-1 rounded-md right-5 hover:bg-red-500 top-1 text-white absolute"
        >
          <MdDelete className="text-xl text-red-600 hover:text-white" />
        </button>
      </SwiperSlide>
    ));
  };

  const handleSubmitPhoto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await addPhotoStore(Image, album?._id, token);
      enqueueSnackbar("Photo added", {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });

      // closeModal();
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Failed", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    }
  };

  const albumsVariants = {
    initial: {
      opacity: 0,
      scale: 0.9,
    },
    animate: (index: number) => ({
      opacity: 1,
      scale: 1,

      transition: {
        delay: index * 0.3,
        duration: 1,
      },
    }),
  };

  // const testDelete = async () => {
  //   await axios.delete(`http://localhost:3000/album/`);
  // };

  return (
    <div className="bg-slate-50 w-[85%]   h-auto  flex justify-center py-5 px-3 items-center">
      <div className="bg-white h-full overflow-y-auto pb-10 rounded-xl w-[98%] shadow-2xl">
        <div className="relative">
          {/* <button onClick={testDelete}>Test delete</button> */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 1 }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            className="h-[500px]  hover:shadow-pink-300 hover:shadow-lg transition-all duration-200  cursor-pointer flex  overflow-hidden"
          >
            {" "}
            <img
              src={
                user?.bgImg
                  ? `http://localhost:3000/uploads/${user?.bgImg}`
                  : BgImg
              }
              onClick={openBgModal}
              className="w-full object-cover rounded-t-xl"
            />
          </motion.div>

          <motion.div className="overflow-hidden flex items-center justify-center hover:shadow-pink-300 hover:shadow-lg transition-all duration-300  border-2  bottom-0 left-[50%] right-auto translate-y-[50%] -translate-x-[50%] rounded-full border-white h-[150px] w-[150px] absolute">
            <motion.img
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5 }}
              variants={{
                hidden: { opacity: 0.8 },
                visible: { opacity: 1 },
              }}
              src={
                user?.profileImg
                  ? `http://localhost:3000/uploads/${user?.profileImg}`
                  : ProfileImg
              }
              onClick={openProfileModal}
              className=" hover:scale-110   cursor-pointer shadow-xl  hover:shadow-pink-300 hover:shadow-lg transition-all duration-300 "
            />
          </motion.div>
        </div>
        <div className="mt-14 px-5 ">
          <motion.h1
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5 }}
            variants={{
              hidden: { opacity: 0.5, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            className="font-semibold text-pink-600 text-3xl"
          >
            All my albums{" "}
            <span className=" text-sm px-2 py-1 mb-1  rounded-md text-black bg-pink-50">
              {albums.length} albums
            </span>
          </motion.h1>
          <div className="h-[1px] bg-pink-600 w-full mt-1"></div>
          <div className="flex mt-10 w-full  flex-wrap gap-4">
            {displayAlbum()}
          </div>
        </div>
      </div>{" "}
      <Modal
        isOpen={photosIsOpen}
        onRequestClose={closeModal}
        overlayClassName="Overlay"
        className="top-[50%] fixed left-[50%] bg-white right-auto w-1/2 overflow-y-auto  border-[1px] p-4 rounded-lg shadow-lg bottom-auto m-r-[-50%] translate-x-[-50%] translate-y-[-50%] h-[70%]"
      >
        <div className="flex items-center w-full justify-between mb-3">
          <motion.h1
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5 }}
            variants={{
              hidden: { opacity: 0.5, x: -10 },
              visible: { opacity: 1, x: 0 },
            }}
            className="text-3xl font-semibold text-pink-600 mb-2 "
          >
            {album?.name}{" "}
            <span className="text-sm px-2 py-1 rounded-md text-black bg-pink-50">
              {album?.photos?.length ? album.photos.length : "0"} photos
            </span>
          </motion.h1>
          <motion.form
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5 }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            onSubmit={handleSubmitPhoto}
          >
            <input
              onChange={handleChangeImage}
              type="file"
              name="image"
              required
            />

            <button className="bg-blue-600 hover:scale-105 transition-all mt-3 font-bold px-5 py-1 hover:bg-blue-700 duration-200 rounded-md text-white ">
              Add image +
            </button>
          </motion.form>
        </div>

        <div className="h-[1px] bg-pink-600 w-full"></div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          className="mt-3 h-[80%] items-center  flex "
        >
          {album?.photos?.length ? (
            <Swiper
              effect={"coverflow"}
              grabCursor={true}
              centeredSlides={true}
              loop={true}
              slidesPerView={"auto"}
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              pagination={{ clickable: true }}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              modules={[EffectCoverflow, Pagination, Navigation]}
              className="mySwiper relative "
            >
              {displayPhotos(album)}
            </Swiper>
          ) : (
            <h1 className="text-center w-full text-3xl text-slate-500">
              Empty album
            </h1>
          )}
        </motion.div>
      </Modal>
      <Modal
        isOpen={bgModalIsOpen}
        onRequestClose={closeModal}
        overlayClassName="Overlay"
        className="top-[50%] fixed left-[50%] bg-white right-auto w-1/2  border-[1px] p-4 rounded-lg shadow-lg bottom-auto m-r-[-50%] translate-x-[-50%] translate-y-[-50%] h-[70%]"
      >
        <motion.h1
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0, y: 5 },
            visible: { opacity: 1, y: 0 },
          }}
          className="text-3xl font-semibold text-pink-600 mb-2 text-center"
        >
          Your background image
        </motion.h1>
        <div className="h-[1px] bg-pink-600 w-full"></div>
        <motion.img
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0.5 },
            visible: { opacity: 1 },
          }}
          src={
            user?.bgImg ? `http://localhost:3000/uploads/${user?.bgImg}` : BgImg
          }
          className="h-[200px] cursor-pointer mx-auto my-4"
        />
        <motion.form
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          onSubmit={handleSubmitBgImg}
          className="mt-4"
        >
          <br />
          <input
            onChange={handleChangeImage}
            type="file"
            name="image"
            required
          />
          <br />
          <button className="bg-blue-600 transition-all mt-3 font-bold px-5 py-1 hover:bg-blue-700 duration-200 rounded-md text-white ">
            Update image
          </button>
        </motion.form>
      </Modal>
      <Modal
        isOpen={editAlbumIsOpen}
        onRequestClose={closeModal}
        overlayClassName="Overlay"
        className="top-[50%]  overflow-y-auto fixed left-[50%] bg-white right-auto w-1/2 border-[1px] p-4 rounded-lg shadow-lg bottom-auto m-r-[-50%] translate-x-[-50%] translate-y-[-50%] h-[70%]"
      >
        <motion.h1
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0, y: 5 },
            visible: { opacity: 1, y: 0 },
          }}
          className="text-3xl font-semibold text-pink-600 mb-2 text-center"
        >
          {album?.name}
        </motion.h1>
        <div className="h-[1px] bg-pink-600 w-full"></div>
        <motion.img
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0.5 },
            visible: { opacity: 1 },
          }}
          src={
            user?.bgImg
              ? `http://localhost:3000/uploads/${album?.albumImg}`
              : BgImg
          }
          className="h-[200px] cursor-pointer mx-auto my-4"
        />
        <motion.form
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          onSubmit={handleSubmitEditAlbum}
          className="mt-4"
        >
          <br />
          <label className="font-bold">Album name:</label>
          <br />
          <input
            type="text"
            className="border-2 rounded-lg p-1 my-1"
            placeholder="Input album name..."
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
          />
          <br />
          <input onChange={handleChangeImage} type="file" name="image" />
          <br />
          <button className="bg-blue-600 transition-all mt-3 font-bold px-5 py-1 hover:bg-blue-700 duration-200 rounded-md text-white ">
            Update album
          </button>
        </motion.form>
      </Modal>
      <Modal
        isOpen={profileModalIsOpen}
        onRequestClose={closeModal}
        overlayClassName="Overlay"
        className="top-[50%] fixed left-[50%] bg-white right-auto w-1/2 border-[1px] p-4 rounded-lg shadow-lg bottom-auto m-r-[-50%] translate-x-[-50%] translate-y-[-50%] h-[70%]"
      >
        <motion.h1
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0, y: 5 },
            visible: { opacity: 1, y: 0 },
          }}
          className="text-3xl font-semibold text-pink-600 mb-2 text-center"
        >
          Your profile image
        </motion.h1>
        <div className="h-[1px] bg-pink-600 w-full"></div>
        <motion.img
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0.5 },
            visible: { opacity: 1 },
          }}
          src={
            user?.profileImg
              ? `http://localhost:3000/uploads/${user?.profileImg}`
              : ProfileImg
          }
          className="h-[150px] w-[150px] rounded-full cursor-pointer mx-auto my-4"
        />
        <motion.form
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          className="mt-4"
          onSubmit={handleSubmitProfileImg}
        >
          <input type="file" onChange={handleChangeImage} name="image" />
          <br />
          <button className="bg-blue-600 transition-all  mt-3 font-bold px-5 py-1 hover:bg-blue-700 duration-200 rounded-md text-white ">
            Update profile
          </button>
        </motion.form>
      </Modal>
      <Modal
        isOpen={singlePhotoIsOpen}
        onRequestClose={closeSinglePhoto}
        overlayClassName="Overlay"
        className="top-[50%] overflow-hidden fixed left-[50%] bg-white  right-auto  border-[1px]  rounded-lg shadow-lg bottom-auto m-r-[-50%] translate-x-[-50%] translate-y-[-50%] "
      >
        <img src={`http://localhost:3000/uploads/${photo}`} />
      </Modal>
    </div>
  );
}

export default Home;

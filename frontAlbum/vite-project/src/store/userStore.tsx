import { create } from "zustand";
import axios from "axios";

type Album = {
  name: string;
  belongsTo: string;
  albumImg: File | null;
  _id: string;
  photos?: string[];
};

type User = {
  _id: string;
  username: string;
  password: string;
  profileImg?: string;
  bgImg?: string;
  albums?: Album[];
};

type State = {
  user: Omit<User, "password"> | null;
  albums: Album[];
  album: Album | null;
};

type CreateAlbumType = {
  name: string;
  belongsTo: string | undefined;
};

type EditAlbumType = {
  name?: string;
  albumImg?: File | null;
  belongsTo: string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentAlbumImg: File | any;
};

type Actions = {
  loginStore: (user: Omit<User, "_id">) => Promise<string>;
  registerStore: (user: Omit<User, "_id">) => void;
  setUser: (user: Omit<User, "password">) => void;
  uploadBgImgStore: (
    bgImg: File | null,
    id: string | undefined,
    token: string | null,
    currentBgImg: string | undefined
  ) => void;

  uploadProfileImgStore: (
    bgImg: File | null,
    id: string | undefined,
    token: string | null,
    profileImg: string | undefined
  ) => void;
  createAlbumStore: (
    albumImg: File | undefined,
    details: CreateAlbumType,
    token: string | null
  ) => void;
  deleteAlbumService: (
    id: string,
    user_id: string | undefined,
    token: string | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    albumPhoto: File | any
  ) => void;
  setAlbum: (album: Album) => void;
  editModalAlbumStore: (
    albumId: string | undefined,
    editAlbum: EditAlbumType,
    token: string | null
  ) => Promise<Album>;
  addPhotoStore: (
    photo: File | null,
    albumId: string | undefined,
    token: string | null
  ) => void;
  removePhotoStore: (
    photo: string,
    albumId: string | undefined,
    token: string | null
  ) => void;
};

const userStore = create<State & Actions>((set) => ({
  user: null,
  album: null,
  albums: [],
  loginStore: async (user: Omit<User, "_id">) => {
    console.log("UserData", user);
    const tokenAPI = await axios.post("http://localhost:3000/user/login", user);
    console.log(tokenAPI);
    return tokenAPI.data;
  },

  setUser: (user: Omit<User, "password">) => {
    console.log("SetUserStore", user);

    set((state) => {
      return {
        ...state,
        user: user,
        albums: user?.albums,
      };
    });
  },

  registerStore: async (user: Omit<User, "_id">) => {
    console.log("UserData registered", user);

    return await axios.post("http://localhost:3000/user", user);
  },

  setAlbum(album: Album) {
    console.log("Album store", album);
    set((state) => ({
      ...state,
      album: { ...album },
    }));
  },

  uploadBgImgStore: async (
    bgImg: File | null,
    id: string | undefined,
    token: string | null,
    currentBgImg: string | undefined
  ) => {
    console.log("Inside uploadBgImgStore", bgImg, token, id);
    const formData = new FormData();

    if (bgImg) {
      formData.append("bgImg", bgImg);
      formData.append("currentBgImg", currentBgImg ? currentBgImg : "");
      console.log(formData.get("bgImg"));
      const uploadbgimg = await axios.post(
        `http://localhost:3000/user/uploadbgImg/${id}`,
        formData,
        { headers: { Authorization: `${token}` } }
      );
      console.log("UploadBgIMg", uploadbgimg, uploadbgimg.data.bgImg);

      set((state) => ({
        ...state,
        user: {
          ...uploadbgimg.data,
          bgImg: `${uploadbgimg.data.bgImg}`,
        },
      }));
      return uploadbgimg;
    }
  },

  uploadProfileImgStore: async (
    bgImg: File | null,
    id: string | undefined,
    token: string | null,
    profileImg: string | undefined
  ) => {
    console.log("Inside uploadBgImgStore", bgImg, token, id);
    const formData = new FormData();

    if (bgImg) {
      formData.append("prImg", bgImg);
      formData.append("profileImg", profileImg ? profileImg : "");
      console.log(formData.get("prImg"));
      const uploadPrImg = await axios.post(
        `http://localhost:3000/user/uploadProfileImg/${id}`,
        formData,
        { headers: { Authorization: `${token}` } }
      );
      set((state) => ({
        ...state,
        user: {
          ...uploadPrImg.data,
          profileImg: `${uploadPrImg.data.profileImg}`,
        },
      }));
      return uploadPrImg;
    }
  },

  createAlbumStore: async (
    albumImg: File | undefined,
    details: CreateAlbumType,
    token: string | null
  ) => {
    console.log("Inside createAlbumStore", albumImg, details, token);

    const formData = new FormData();
    //localhost:3000/album/create/http:
    if (albumImg && details.belongsTo && details.name) {
      formData.append("albumImg", albumImg);
      formData.append("belongsTo", details.belongsTo);
      formData.append("name", details.name);

      const createAlbum = await axios.post(
        "http://localhost:3000/album/create/",
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(
        "CreateAlbum",
        createAlbum,
        createAlbum.data[0].albums[createAlbum.data[0].albums.length - 1]
      );

      set((state) => {
        console.log("Albums", state.albums);
        return {
          ...state,
          albums: [
            ...state.albums,
            {
              ...createAlbum.data[0].albums[
                createAlbum.data[0].albums.length - 1
              ],
            },
          ],
        };
      });
      return createAlbum;
    }
  },

  async deleteAlbumService(
    id: string,
    user_id: string | undefined,
    token: string | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    albumPhoto: File | any
  ) {
    console.log("DeleteAlbumService", id, user_id);

    const deleteAlbum = await axios.delete(
      `http://localhost:3000/album/delete/${id}/${user_id}/${albumPhoto}`,

      { headers: { Authorization: token } }
    );

    console.log("Deletion", deleteAlbum);

    set((state) => ({
      ...state,
      albums: state.albums.filter((album) => album._id !== id),
    }));
  },

  async editModalAlbumStore(
    albumId: string | undefined,
    editAlbum: EditAlbumType,
    token
  ) {
    console.log("editModalAlbumStore", albumId, editAlbum);

    const formData = new FormData();

    formData.append("name", editAlbum.name ? editAlbum.name : "");
    formData.append("albumImg", editAlbum.albumImg ? editAlbum.albumImg : "");
    formData.append(
      "currentAlbumImg",
      editAlbum.currentAlbumImg ? editAlbum.currentAlbumImg : ""
    );
    formData.append(
      "belongsTo",
      editAlbum.belongsTo ? editAlbum.belongsTo : ""
    );

    const editAlbumAPI = await axios.patch(
      `http://localhost:3000/album/edit/album/${albumId}`,
      formData,
      { headers: { Authorization: token } }
    );

    console.log(editAlbumAPI, editAlbumAPI.data);

    set((state) => ({
      ...state,
      albums: state.albums.map((album) =>
        album._id === albumId ? editAlbumAPI.data : album
      ),
    }));
    return editAlbumAPI.data;
  },
  async addPhotoStore(
    photo: File | null,
    albumId: string | undefined,
    token: string | null
  ) {
    console.log("Inside addPhotoStore", photo);

    const formData = new FormData();
    if (photo) {
      formData.append("photo", photo);
    }

    const addPhotoStore = await axios.patch(
      `http://localhost:3000/album/addPhoto/${albumId}`,
      formData,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    console.log("Added photo", addPhotoStore.data);

    set((state) => ({
      ...state,
      album: addPhotoStore.data,
      albums: state.albums.map((album) =>
        addPhotoStore.data._id === album._id ? addPhotoStore.data : album
      ),
    }));
  },

  async removePhotoStore(
    photo: string,
    albumId: string | undefined,
    token: string | null
  ) {
    console.log("Inside removePhoto store", photo, albumId);

    const removePhotoFromAlbum = await axios.delete(
      `http://localhost:3000/album/removePhoto/${photo}/${albumId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    console.log("Removed photo", removePhotoFromAlbum);

    set((state) => ({
      ...state,
      album: removePhotoFromAlbum.data,
      albums: state.albums.map((album) =>
        removePhotoFromAlbum.data._id === album._id
          ? removePhotoFromAlbum.data
          : album
      ),
    }));
  },
}));

export default userStore;

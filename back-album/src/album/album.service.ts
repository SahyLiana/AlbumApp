import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Album } from 'src/user/schema/album.schema';
import { User } from 'src/user/schema/userSChema';
import { AlbumDto } from './dto/album.dto';
import { promises as fs } from 'fs';
import { join } from 'path';
// import * as path from 'path';

@Injectable()
export class AlbumService {
  // private uploadDir = join(__dirname, '..', 'uploads');
  private uploadDir = join(
    '/home/sahy/Tutorials/nest-multer/albumApp/back-album/uploads/',
  );

  constructor(
    @InjectModel(Album.name) private albumModel: Model<Album>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createAlbum(
    createData: AlbumDto,

    file,
  ) {
    console.log('CreateAlbum', createData, createData.belongsTo, file);
    const isValid = mongoose.Types.ObjectId.isValid(createData.belongsTo);
    if (!isValid) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    try {
      const newAlbum = new this.albumModel({
        ...createData,
        albumImg: file.filename,
      });

      const createdAlbum = await newAlbum.save();

      const updatedUser = await this.userModel.findOneAndUpdate(
        { _id: createData.belongsTo },
        { $push: { albums: createdAlbum } },
        { new: true },
      );

      console.log('User updated', updatedUser);

      return await this.userModel
        .find({ _id: createData.belongsTo })
        .populate('albums');
    } catch (error) {
      console.log(error);
      throw new HttpException('Duplicate album name', HttpStatus.FORBIDDEN);
    }
    // console.log('CreateAlbum', createData.name, file);

    // return { createData, file };
  }

  async deleteAlbumService(albumId: string, userId: string, albumImg: any) {
    console.log('Inside deleteAlbumService', albumId, userId, albumImg);
    const isValidAlbumId = mongoose.Types.ObjectId.isValid(albumId);
    const isValidUserId = mongoose.Types.ObjectId.isValid(userId);

    if (!isValidAlbumId || !isValidUserId) {
      throw new HttpException('Invalid Id', HttpStatus.NOT_FOUND);
    }

    try {
      const deletedAlbumInUser = await this.userModel.updateOne(
        { _id: userId },
        { $pull: { albums: albumId } },
      );

      if (deletedAlbumInUser.modifiedCount === 0) {
        console.log('No modification');
        throw new HttpException('No modification', HttpStatus.NOT_FOUND);
      } else {
        const albumDelete = await this.albumModel.findByIdAndDelete({
          _id: albumId,
        });

        const filePath = join(this.uploadDir, albumImg);

        try {
          console.log(filePath);

          console.log(process.cwd());
          const stats = await fs.stat(filePath);
          console.log('File stats', stats);
          await fs.access(filePath); // Check if the file exists
          await fs.unlink(filePath); // Delete the file
          console.log('File deleted successfully');
        } catch (err) {
          if (err.code === 'ENOENT') {
            console.error('File does not exist:', 'test.txt');
          } else {
            console.error('Error deleting file:', err);
          }
        }

        console.log('AlbumDelete', albumDelete);
        return albumDelete;
      }
    } catch (error) {
      console.log(error);
    }
    return { albumId, userId };
  }

  async editAlbumService(
    albumId: string,
    albumEdit: { name: string; belongsTo: string; currentAlbumImg: string },
    file,
  ) {
    console.log(
      'Inside editAlbum service',
      albumId,
      albumEdit,
      albumEdit.currentAlbumImg,
    );

    const isValidAlbumId = mongoose.Types.ObjectId.isValid(albumId);

    const isValidAlbumUserId = mongoose.Types.ObjectId.isValid(
      albumEdit.belongsTo,
    );

    if (!isValidAlbumId && !isValidAlbumUserId) {
      throw new HttpException('Invalid Ids', HttpStatus.NOT_FOUND);
    }

    if (!albumEdit.name && !file) {
      throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
    }

    try {
      if (!file) {
        const updateAlbum = await this.albumModel.findOneAndUpdate(
          { _id: albumId },
          { $set: { name: albumEdit.name } },
          { new: true },
        );
        console.log(updateAlbum);
        return updateAlbum;
      } else if (!albumEdit.name) {
        const updateAlbum = await this.albumModel.findOneAndUpdate(
          { _id: albumId },
          { $set: { albumImg: file.filename } },
          { new: true },
        );

        const filePath = join(this.uploadDir, albumEdit.currentAlbumImg);

        try {
          console.log(filePath);

          console.log(process.cwd());
          const stats = await fs.stat(filePath);
          console.log('File stats', stats);
          await fs.access(filePath); // Check if the file exists
          await fs.unlink(filePath); // Delete the file
          console.log('File deleted successfully');
        } catch (err) {
          if (err.code === 'ENOENT') {
            console.error('File does not exist:', 'test.txt');
          } else {
            console.error('Error deleting file:', err);
          }
        }

        console.log(updateAlbum);
        return updateAlbum;
      } else {
        const updateAlbum = await this.albumModel.findOneAndUpdate(
          { _id: albumId },
          { $set: { albumEdit, albumImg: file.filename } },
          { new: true },
        );

        const filePath = join(this.uploadDir, albumEdit.currentAlbumImg);
        try {
          console.log(filePath);

          console.log(process.cwd());
          const stats = await fs.stat(filePath);
          console.log('File stats', stats);
          await fs.access(filePath); // Check if the file exists
          await fs.unlink(filePath); // Delete the file
          console.log('File deleted successfully');
        } catch (err) {
          if (err.code === 'ENOENT') {
            console.error('File does not exist:', 'test.txt');
          } else {
            console.error('Error deleting file:', err);
          }
        }
        console.log(updateAlbum);
        return updateAlbum;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async addPhotoService(albumId: string, file) {
    console.log('Addphotoservice', albumId, file);

    const isValid = mongoose.Types.ObjectId.isValid(albumId);

    if (!isValid) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    try {
      const addPhoto = await this.albumModel.findOneAndUpdate(
        { _id: albumId },
        { $push: { photos: file.filename } },
        { new: true },
      );
      return addPhoto;
    } catch (error) {
      console.log(error);
    }
  }

  async removePhotoService(photo: string, albumId: string) {
    console.log('Inside removePhotoService', photo, albumId);

    const isValid = mongoose.Types.ObjectId.isValid(albumId);

    if (!isValid) {
      throw new HttpException('Invalid albumId', HttpStatus.BAD_REQUEST);
    }

    try {
      const removePhotoFromAlbum = await this.albumModel.findOneAndUpdate(
        { _id: albumId },
        { $pull: { photos: photo } },
        { new: true },
      );

      // await fs.unlink(`../uploads/${photo}`, (err) => {
      //   if (err) {
      //     console.error('Error for file deletion', err);
      //     return err;
      //   }
      //   console.log('File deleted');
      // });

      const filePath = join(this.uploadDir, photo);

      // // await fs.unlink(filePath, (err) => {
      // //   if (err) {
      // //     console.error('Error for file deletion', err);
      // //     return err;
      // //   }
      // //   console.log('File deleted');
      // // });

      try {
        console.log(filePath);

        console.log(process.cwd());
        const stats = await fs.stat(filePath);
        console.log('File stats', stats);
        await fs.access(filePath); // Check if the file exists
        await fs.unlink(filePath); // Delete the file
        console.log('File deleted successfully');
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.error('File does not exist:', 'test.txt');
        } else {
          console.error('Error deleting file:', err);
        }
      }

      // console.log('FilePath is', filePath);
      // try {
      //   await fs.unlinkSync('test.txt');
      //   console.log('Success');
      // } catch (error) {
      //   console.log('Failed', error);
      // }

      return removePhotoFromAlbum;
    } catch (error) {
      console.log(error);
    }
  }

  async testDelete() {
    // const filePath = path.join(this.uploadDir, photo);
    // await fs.unlink(filePath, (err) => {
    //   if (err) {
    //     console.error('Error for file deletion', err);
    //     return err;
    //   }
    //   console.log('File deleted');
    // });
    // console.log('FilePath is', filePath);

    const filePath = this.uploadDir + 'test.txt';

    try {
      console.log(filePath);

      console.log(process.cwd());
      const stats = await fs.stat(filePath);
      console.log('File stats', stats);
      await fs.access(filePath); // Check if the file exists
      await fs.unlink(filePath); // Delete the file
      console.log('File deleted successfully');
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.error('File does not exist:', 'test.txt');
      } else {
        console.error('Error deleting file:', err);
      }
    }
  }
}

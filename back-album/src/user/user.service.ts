import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/userSChema';
import mongoose, { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class UserService {
  private uploadDir = join(
    '/home/sahy/Tutorials/nest-multer/albumApp/back-album/uploads/',
  );

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtSerice: JwtService,
  ) {}

  async registerService(user: UserDto) {
    console.log('Inside userservice', user);

    // const { confirm, ...userData } = user;

    try {
      const newUser = new this.userModel(user);
      //   return user;
      return await newUser.save();
    } catch (error) {
      console.log(error);
      throw new HttpException('Duplicated user', HttpStatus.FORBIDDEN);
    }
  }

  async validateUser(user: UserDto) {
    console.log(user);
    const findUser = await this.userModel.findOne({ username: user.username });
    if (!findUser) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    if (findUser.password === user.password) {
      const userData = {
        username: findUser.username,
        _id: findUser._id,
      };
      return this.jwtSerice.sign(userData);
    }
    throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }

  async getDashboard(user: any) {
    const userData = await this.userModel
      .findOne({ _id: user._id })
      .populate('albums');

    console.log('Userdata', userData);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...myUser } = userData;
    console.log('Myuser', myUser);
    return myUser;
  }

  async uploadBgImgService(file, id: string, body: any) {
    console.log('file', file, id);
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      console.log('not valid id');
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    console.log('File name is', file.filename, body);

    if (body.currentBgImg) {
      const filePath = join(this.uploadDir, body.currentBgImg);
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

    const uploadBgImgVal = await this.userModel.findByIdAndUpdate(
      { _id: id },
      { bgImg: file.filename },
      { new: true },
    );

    console.log('UPloadbgimgval', uploadBgImgVal);

    return uploadBgImgVal;
  }

  async uploadProfileImgService(file, id: string, body: any) {
    console.log('file', file, id);
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      console.log('not valid id');
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    console.log('File name is', file.filename, body);

    if (body.profileImg) {
      const filePath = join(this.uploadDir, body.profileImg);
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

    const uploadProfileImgVal = await this.userModel
      .findOneAndUpdate(
        { _id: id },
        { profileImg: file.filename },
        { new: true, useFindAndModify: false },
      )
      .exec();

    console.log('UPloadbProfileimgval', uploadProfileImgVal);

    return uploadProfileImgVal;
  }
}

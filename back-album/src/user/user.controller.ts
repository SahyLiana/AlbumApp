import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { extname } from 'path';
import { UserService } from './user.service';
import { JwtAuthGuard } from './guards/jwt.guards';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  getUsers() {
    return 'Get all users';
  }

  @Post()
  @UsePipes(new ValidationPipe())
  register(@Body() user: UserDto) {
    return this.userService.registerService(user);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  loginFunction(@Body() loginData: UserDto) {
    return this.userService.validateUser(loginData);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  dashboard(@Req() req: Request) {
    console.log('Dashboard');
    console.log(req.user);

    // return req.user;
    if (req.user) return this.userService.getDashboard(req.user);
  }

  @Post('/uploadbgImg/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('bgImg', {
      storage: diskStorage({
        destination: './uploads', // Define your upload directory here
        filename: (req, file, cb) => {
          const fileName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTYpes = ['image/jpeg', 'image/png'];
        if (allowedTYpes.includes(file.mimetype)) {
          console.log('File size', file.size);
          cb(null, true);
        } else {
          console.log('Invalid file type');
          cb(new BadRequestException('Invalid file type'), false);
        }
      },
      limits: {
        fileSize: 2_000_000,
      },
    }),
  )
  uploadFile(
    @UploadedFile()
    file,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    // console.log('file', file, id);
    // const isValid = mongoose.Types.ObjectId.isValid(id);
    // if (!isValid) {
    //   console.log('not valid id');
    //   throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    // }

    // const uploadBgImgVal=await this.

    return this.userService.uploadBgImgService(file, id, body);
  }

  @Post('/uploadProfileImg/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('prImg', {
      storage: diskStorage({
        destination: './uploads', // Define your upload directory here
        filename: (req, file, cb) => {
          const fileName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTYpes = ['image/jpeg', 'image/png'];
        if (allowedTYpes.includes(file.mimetype)) {
          console.log('File size', file.size);
          cb(null, true);
        } else {
          console.log('Invalid file type');
          cb(new BadRequestException('Invalid file type'), false);
        }
      },
      limits: {
        fileSize: 2_000_000,
      },
    }),
  )
  uploadProfile(
    @UploadedFile()
    file,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    // console.log('file', file, id);
    // const isValid = mongoose.Types.ObjectId.isValid(id);
    // if (!isValid) {
    //   console.log('not valid id');
    //   throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    // }

    // const uploadBgImgVal=await this.

    return this.userService.uploadProfileImgService(file, id, body);
  }
}

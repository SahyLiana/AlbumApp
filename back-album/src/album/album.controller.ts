import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/user/guards/jwt.guards';

import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { AlbumService } from './album.service';
import { AlbumDto } from './dto/album.dto';

@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Post('/create/')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('albumImg', {
      storage: diskStorage({
        destination: './uploads', // Define your upload directory here
        filename: (req, file, cb) => {
          console.log('My file is', file);
          // console.log('My request is', req.body);
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
  createAlbum(
    @Body() createData: AlbumDto,
    @Param('id') id: string,
    //The file variable here will have the fileName value that we have assigned earlier i.e file.filename in album.service
    @UploadedFile() file,
  ) {
    return this.albumService.createAlbum(createData, file);
  }

  @Delete('/delete/:albumId/:userId/:albumImg')
  @UseGuards(JwtAuthGuard)
  deleteAlbum(
    @Param('albumId') albumId: string,
    @Param('userId') userId: string,
    @Param('albumImg') albumImg: string | undefined,
  ) {
    return this.albumService.deleteAlbumService(albumId, userId, albumImg);
  }

  @Patch('/edit/album/:albumId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('albumImg', {
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
  editAlbum(
    @UploadedFile() file,
    @Param('albumId') albumId: string,
    @Body()
    albumEdit: { name: string; belongsTo: string; currentAlbumImg: string },
  ) {
    return this.albumService.editAlbumService(albumId, albumEdit, file);
  }

  @Patch('/addPhoto/:albumId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('photo', {
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
  addPhoto(@Param('albumId') albumId: string, @UploadedFile() file) {
    return this.albumService.addPhotoService(albumId, file);
  }

  @Delete('/removePhoto/:photo/:albumId')
  @UseGuards(JwtAuthGuard)
  removePhoto(
    @Param('photo') photo: string,
    @Param('albumId') albumId: string,
  ) {
    return this.albumService.removePhotoService(photo, albumId);
  }

  @Delete()
  testDelete() {
    return this.albumService.testDelete();
  }
}

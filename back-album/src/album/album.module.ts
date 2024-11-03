import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { PassportModule } from '@nestjs/passport';
// import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/user/strategies/jwt.strategy';
import { AlbumService } from './album.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, AlbumSchema } from 'src/user/schema/album.schema';
import { User, UserSchema } from 'src/user/schema/userSChema';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([
      { name: Album.name, schema: AlbumSchema },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [AlbumController],
  providers: [AlbumService, JwtStrategy],
})
export class AlbumModule {}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Album } from './album.schema';
import mongoose from 'mongoose';

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: true })
  password: string; //

  @Prop({ required: false })
  bgImg: string;

  @Prop({ required: false })
  profileImg: string;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album',
    },
  ])
  albums?: Album[];
}

export const UserSchema = SchemaFactory.createForClass(User);

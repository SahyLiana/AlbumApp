import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MinLength } from 'class-validator';

@Schema()
export class Album {
  @MinLength(3)
  @Prop({ unique: true, required: true })
  name: string;
  @Prop({ required: true })
  albumImg: string;
  @Prop({ required: true })
  belongsTo: string;
  @Prop()
  photos?: string[];
}

export const AlbumSchema = SchemaFactory.createForClass(Album);

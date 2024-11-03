import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AlbumDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  belongsTo: string;
}

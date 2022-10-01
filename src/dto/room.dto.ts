import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createRoomDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsString()
  description: string;
}

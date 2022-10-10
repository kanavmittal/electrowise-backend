import { IsNotEmpty, IsNumber } from 'class-validator';

export class postFollowDto {
  @IsNotEmpty()
  @IsNumber()
  follow_id: number;
}

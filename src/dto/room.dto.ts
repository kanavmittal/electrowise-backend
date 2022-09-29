import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class createRoomDto {
    @IsNotEmpty()
    @IsString()
    name :string
    @IsNumber()
    @IsNotEmpty()
    user_id: number
    @IsString()
    description: string
}
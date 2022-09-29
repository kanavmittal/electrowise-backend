import { IsNotEmpty,IsNumber } from "class-validator"

export class postFollowDto{
    @IsNotEmpty()
    @IsNumber()
    user_id:number
    @IsNotEmpty()
    @IsNumber()
    follow_id:number
}
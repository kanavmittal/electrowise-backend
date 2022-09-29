import { Controller,Request, Get, UseGuards, Post, Body, Param, Req } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { createRoomDto } from 'src/dto';
import { RoomsService } from './rooms.service';

@Controller('room')
export class RoomsController {
    constructor(private RoomSevice: RoomsService){}
    @UseGuards(AuthenticatedGuard)
    @Get('list')
    getRooms(@Request() req): any{
       return this.RoomSevice.getRooms(req);
    }
    @UseGuards(AuthenticatedGuard)
    @Get(':id')
    getRoom(@Param()params, @Request() req){
        return this.RoomSevice.getRoom(req, parseInt(params.id));
    }
    @UseGuards(AuthenticatedGuard)
    @Post('create')
    createRoom(@Body() body:createRoomDto):any {
        return this.RoomSevice.createRooms(body)
    }
    @UseGuards(AuthenticatedGuard)
    @Get('data/:id')
    getRoomData(@Param()params, @Request() req){
        return this.RoomSevice.getRoomData(req, parseInt(params.id));
    }
    @UseGuards(AuthenticatedGuard)
    @Get('device/:id')
    getRoomDevices(@Param() params, @Request() req){
        return this.RoomSevice.getRoomDevices(req,parseInt(params.id));
    }
}

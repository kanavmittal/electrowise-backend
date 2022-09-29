import {
  Controller,
  Request,
  Get,
  UseGuards,
  Post,
  Body,
  Param,
  Req,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { postFollowDto } from 'src/dto';
import { SharingService } from './sharing.service';

@Controller('sharing')
export class SharingController {
  constructor(private SharingService: SharingService) {}
  @UseGuards(AuthenticatedGuard)
  @Get('getPendingRequest')
  getPendingRequests(@Request() req): any {
    return this.SharingService.getPendingRequests(req);
  }
  @UseGuards(AuthenticatedGuard)
  @Post('sendRequest')
  sendReq(@Body() body: postFollowDto): any {
    return this.SharingService.postFollow(body);
  }
  @UseGuards(AuthenticatedGuard)
  @Post('deleteRequest')
  delete(@Body() body: postFollowDto): any {
    return this.SharingService.deleteReq(body);
  }
  @UseGuards(AuthenticatedGuard)
  @Post('accept')
  accetReq(@Body() body: postFollowDto): any {
    return this.SharingService.acceptRequests(body);
  }
  @UseGuards(AuthenticatedGuard)
  @Get('followers')
  followList(@Request() req): any {
    return this.SharingService.seeFollowers(req);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('search/:uname')
  searchUser(@Param() query): any {
    return this.SharingService.searchUser(query.uname);
  }
  @UseGuards(AuthenticatedGuard)
  @Get('following')
  following(@Request() req): any {
    return this.SharingService.Following(req);
  }
  @UseGuards(AuthenticatedGuard)
  @Get('data/:id')
  getData(@Param() query, @Request() req) {
    return this.SharingService.shareData(req, parseInt(query.id));
  }
}

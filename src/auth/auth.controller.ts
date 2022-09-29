import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { authRegisterDto } from 'src/dto';
import { AuthenticatedGuard } from './authenticated.guard';
import { LocalAuthGuard } from './localAuth.guard';

@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  Login(@Request() req, @Res({ passthrough: true }) response): any {
    return this.AuthService.login(req, response);
  }
  @Post('register')
  Register(@Body() dto: authRegisterDto) {
    return this.AuthService.Register(dto);
  }
  @UseGuards(AuthenticatedGuard)
  @Get('verify')
  getHello(@Request() req): any {
    return {
      statusCode: 200,
      message: 'user logged in',
      error: '',
      uid: req.user.id,
      electricity_cost: req.user.electricity_cost,
      username: req.user.username,
      green_coin: req.user.green_coins,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('logout')
  logout(@Request() req, @Res({ passthrough: true }) response): any {
    response.clearCookie('session');
    return { msg: 'The user session has ended' };
  }
}

import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { authLoginDto, authRegisterDto, user } from 'src/dto';
@Injectable()
export class AuthService {
  constructor(
    private DatabaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}
  async Register(dto: authRegisterDto) {
    try {
      var data = await this.DatabaseService.user.create({
        data: {
          username: dto.username,
          password: dto.password,
          email: dto.email,
          electricty_cost: dto.cost,
          phone_number: '0',
        },
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new HttpException('Error while registering', 500);
    }
  }
  async login(req, response) {
    const payload = { username: req.user.username, sub: req.user.id };
    var access_token = this.jwtService.sign(payload);
    response.cookie('session', access_token, {
      expires: new Date(new Date().getTime() + 8640000),
      sameSite: 'strict',
      httpOnly: false,
    });
    return { payload, access_token };
  }
}

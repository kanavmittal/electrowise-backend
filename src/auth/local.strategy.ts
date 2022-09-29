import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private DatabaseService: DatabaseService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.DatabaseService.user.findMany({
      where: {
        username: username,
        password: password,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

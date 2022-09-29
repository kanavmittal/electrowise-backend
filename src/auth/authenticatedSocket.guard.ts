import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticatedSocketGuard implements CanActivate {
  private jwtService: JwtService;
  async canActivate(context: any): Promise<any> {
    const bearerToken = context.args[0].handshake.query?.token;

    if (!bearerToken) {
      return false;
    }
    var { decoded, err } = await this.jwtService.verify(bearerToken);
    if (err) {
      return false;
    }
    return true;
  }
}

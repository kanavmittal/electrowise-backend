import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class AuthenticatedGuard implements CanActivate {
//   async canActivate(context: ExecutionContext) {
//     // old passport-local
//     // const request = context.switchToHttp().getRequest();
//     // return request.isAuthenticated();
//   }
// }

@Injectable()
export class AuthenticatedGuard extends AuthGuard('jwt') {
  
}

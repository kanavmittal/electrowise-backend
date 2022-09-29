import { ForbiddenException, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { SocketWithAuth } from './dto';

export class SocketIOAdapter extends IoAdapter {
  constructor(
    private app: INestApplication,
    private configService: ConfigService,
  ) {
    super(app);
  }
  createIOServer(port: number, options?: ServerOptions) {
    const cors = {
      origin: ['http://localhost:3000'],
    };

    const optionswithCors: ServerOptions = {
      ...options,
      cors,
    };
    const jwtService = this.app.get(JwtService);
    const server: Server = super.createIOServer(port, optionswithCors);
    server.of('electrowise').use(createMiddleWare(jwtService));
    return server;
  }
}

const createMiddleWare =
  (jwtService: JwtService) => (socket: SocketWithAuth, next) => {
    const type =
      socket.handshake.auth['type'] || socket.handshake.headers['type'];
    const test = socket.request.headers.cookie;
    console.log(test);
    if (type == 'user') {
      const token =
        socket.handshake.auth['token'] ||
        (socket.handshake.headers['token'] as string);
      try {
        const payload = jwtService.verify(token);
        socket.sub = payload.sub;
        socket.username = payload.useraname;
        socket.type = 'user';
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    }
    if (type == 'device') {
      var s = socket.handshake.headers['sub'] as string;
      var sub = parseInt(s);
      socket.sub = sub;
      socket.username = 'kanavmittal';
      socket.type = 'device';
      next();
    }
  };

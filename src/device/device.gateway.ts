import { UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { AuthenticatedSocketGuard } from 'src/auth/authenticatedSocket.guard';
import { SocketWithAuth, toggleClientData } from 'src/dto';

@WebSocketGateway({
  namespace: 'electrowise',
})
export class DeviceGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() io: Namespace;
  afterInit(): void {
    console.log('Initialized');
  }
  handleConnection(client: SocketWithAuth, ...args: any[]) {
    client.join(`${client.type}-${client.sub}`);

    // const socket = this.io.sockets;
    // console.log(`client ${client.sub} connected`);
    // console.log(`number of connection ${socket}`);
    // this.io.emit('testing', `hello from ${client.sub}`);
  }
  handleDisconnect(client: SocketWithAuth) {
    const socket = this.io.sockets;
    console.log(`client ${client.sub} disconnected`);
    console.log(`number of connection ${socket.size}`);
  }

  @SubscribeMessage('toggle')
  handleToggle(client: SocketWithAuth, data) {
    this.io.to(`device-${client.sub}`).emit('toggle', data);
  }

  @SubscribeMessage('status')
  handleStatus(client: SocketWithAuth, data) {
    this.io.to(`user-${client.sub}`).emit('status', data);
  }

  // @SubscribeMessage('data')
  // handleData(client: SocketWithAuth, data) {
  //   this.io.to(`devices-of-${client.sub}`).emit('toggleDevice', data);
  // }

}

import {
  WebSocketServer,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { SocketsMessageType } from './sockets-message.type';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JwtPayloadInterface } from '../../interfaces/jwt-payload.interface';

@WebSocketGateway()
export class SocketsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly jwtService: JwtService) {}

  @WebSocketServer()
  private server: Server;
  private clients = new Map<number, Socket>();

  //TODO: log error here
  private guard(client: Socket): JwtPayloadInterface {
    const token = client.handshake.query?.token?.toString();
    if (!token) client.disconnect();

    try {
      return this.jwtService.verify(token);
    } catch (err) {
      return null;
    }
  }

  handleConnection(client: Socket) {
    const payload = this.guard(client);
    if (payload) {
      this.clients.set(payload.sub, client);
    } else {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const payload = this.guard(client);
    this.clients.delete(payload.sub);
  }

  //TODO: добавить ошибку в лог об отсутствии клиента для отправки
  sendSocketMessage<T>(message: SocketsMessageType<T>) {
    const client = this.clients.get(message.userId);
    if (client) {
      client.emit(message.event, message.body);
    }
  }

  @Cron(CronExpression.EVERY_SECOND)
  doPing(): void {
    this.server.emit('ping_event', 'ping');
    return;
  }
}

import { Injectable } from '@nestjs/common';
import { SocketsGateway } from './sockets.gateway';
import { SocketsMessageType } from './sockets-message.type';

@Injectable()
export class SocketsService {
  constructor(private readonly gateway: SocketsGateway) {}

  send<T>(message: SocketsMessageType<T>) {
    this.gateway.sendSocketMessage<T>(message);
  }
}

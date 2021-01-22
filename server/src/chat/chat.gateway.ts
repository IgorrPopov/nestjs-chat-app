import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;
  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }

  // @UseGuards(JwtAuthGuard)
  @SubscribeMessage('events')
  async handleEvent(
    @MessageBody() data: unknown,
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<unknown>> {
    // this.server.emit('events', data);
    // client.broadcast({ event: 'events', data });

    const message = await this.chatService.createMessage(data, 'ididididididi');

    console.log({ message });

    client.broadcast.emit('events', data);

    return { event: 'events', data };
  }
}

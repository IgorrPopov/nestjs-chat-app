import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { ChatService } from './chat.service';

import { CreateMessageDto } from './dto/create-message.dto';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedChatUsers: any[] = [];

  constructor(
    private readonly chatService: ChatService,
    private readonly usersService: UsersService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    console.log('New connection: ', client.id);

    const client_id = client.handshake.query._id;

    if (client_id) {
      const user = await this.usersService.findOne(client_id);

      this.connectedChatUsers.push({
        ...user.toObject(),
        socket_id: client.id,
      });

      client.broadcast.emit('loadUsers', { users: this.connectedChatUsers });
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client: ', client.id, ' disconnected');

    if (this.connectedChatUsers.length > 0 && client.id) {
      this.connectedChatUsers = this.connectedChatUsers.filter(
        (user) => user.socket_id !== client.id,
      );

      client.broadcast.emit('loadUsers', { users: this.connectedChatUsers });
    }
  }

  @SubscribeMessage('loadUsers')
  loadUsers(@ConnectedSocket() client: Socket) {
    return { event: 'loadUsers', data: { users: this.connectedChatUsers } };
  }

  @SubscribeMessage('loadMessages')
  async loadMessages() {
    const messages = await this.chatService.getAllMessages();
    return { messages };
  }

  @UsePipes(
    new ValidationPipe({
      exceptionFactory: (errors) => new WsException('asdfasdfsd'),
    }),
  )
  @SubscribeMessage('events')
  async handleEvent(
    @MessageBody() createMessageDto: CreateMessageDto,
  ): Promise<void> {
    const message = await this.chatService.createMessage(createMessageDto);

    this.server.emit('events', { message });
  }

  @SubscribeMessage('join-video-chat-room')
  handleUserJoinVideoChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const { room_id, user, partner } = data;

    this.server
      .to(partner.socket_id)
      .emit('video-chat-invitation', { room_id, user });

    client.join(room_id);
  }
}

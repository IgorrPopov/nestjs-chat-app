import {
  HttpException,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
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
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { ChatAuthGuard } from './chat-auth.guard';
import { ChatHttpExceptionFilter } from './chat-http-exception.filter';
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
    private readonly authService: AuthService,
  ) {}

  @UseGuards(ChatAuthGuard)
  async handleConnection(client: Socket, ...args: any[]) {
    console.log('New connection: ', client.id);

    const token = client.handshake.query?.access_token;

    if (!token) throw new WsException('Unauthorized');

    const decoded = await this.authService.getUserByJwtToken(token);

    if (!decoded) throw new WsException('Unauthorized');

    if (decoded && decoded.sub) {
      const user = await this.usersService.findOne(decoded.sub);

      if (!user) throw new WsException('Unauthorized');

      this.connectedChatUsers.push({
        ...user.toObject(),
        socket_id: client.id,
      });

      client.broadcast.emit('loadUsers', { users: this.connectedChatUsers });
    } else {
      throw new WsException('Unauthorized');
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

  @UseGuards(ChatAuthGuard)
  @SubscribeMessage('loadUsers')
  loadUsers(@ConnectedSocket() client: Socket) {
    return { event: 'loadUsers', data: { users: this.connectedChatUsers } };
  }

  @UseGuards(ChatAuthGuard)
  @SubscribeMessage('loadMessages')
  async loadMessages() {
    const messages = await this.chatService.getAllMessages();
    return { messages };
  }

  @UseFilters(ChatHttpExceptionFilter) // to catch exseption from ValidationPipe
  @UseGuards(ChatAuthGuard)
  @UsePipes(ValidationPipe)
  @SubscribeMessage('events')
  async handleEvent(
    @MessageBody() createMessageDto: CreateMessageDto,
  ): Promise<void> {
    const message = await this.chatService.createMessage(createMessageDto);
    this.server.emit('events', { message });
  }

  @UseGuards(ChatAuthGuard)
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

    const allSockets = this.server.of('/').sockets;
    const partnerSocket = allSockets[partner.socket_id];

    partnerSocket.join(room_id);
  }

  @SubscribeMessage('end-of-video-call')
  handleUserEndVideoCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const { room_id } = data;

    this.server.to(room_id).emit('end-of-video-call');
  }
}

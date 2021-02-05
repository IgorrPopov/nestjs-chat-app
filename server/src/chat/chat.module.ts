import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { Message, MessageSchema } from './entities/message.entity';
import { ChatService } from './chat.service';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),
    UsersModule,
    AuthModule,
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}

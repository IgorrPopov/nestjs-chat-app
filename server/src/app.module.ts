import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot('mongodb://chat_db:27017/chat-app', {
      autoIndex: true, // makes email unique
    }),
    AuthModule,
    ChatModule,
  ],
})
export class AppModule {}

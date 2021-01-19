import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppGateway } from './app.gateway';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot('mongodb://chat_db:27017/chat-app', {
      autoIndex: true,
    }), // makes email unique
  ],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}

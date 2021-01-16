import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src'),
    }),
  ],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}

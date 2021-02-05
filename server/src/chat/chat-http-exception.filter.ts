import {
  ArgumentsHost,
  Catch,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(HttpException)
export class ChatHttpExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const properException = new WsException(exception.getResponse());
    super.catch(properException, host);
  }
}

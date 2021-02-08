import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ChatAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const data = context.switchToWs().getData();
    // console.log({ data });
    if (data.access_token) {
      const decoded = await this.authService.getUserByJwtToken(
        data.access_token,
      );

      if (!decoded) {
        throw new WsException('Unauthorized');
      }
    }

    return true;
  }
}

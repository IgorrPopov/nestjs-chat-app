import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JWT_SECRET } from '../config/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    isValidUser: if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) break isValidUser;

      const { name, email, _id } = user;
      return { name, email, _id };
    }

    return null;
  }

  async login(user: any) {
    const payload = { username: user.name, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getUserByJwtToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verify(token, { secret: JWT_SECRET });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return false;
      }
    }
  }
}

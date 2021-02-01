import { UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Headers,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.usersService.findAll(paginationQuery);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Headers('Authorization') authorizationHeader: string,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const token = authorizationHeader.replace('Bearer ', '');
    const decoded = await this.authService.getUserByJwtToken(token);

    if (!decoded || decoded.sub !== id) throw new UnauthorizedException();

    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Headers('Authorization') authorizationHeader: string,
    @Param('id') id: string,
  ) {
    const token = authorizationHeader.replace('Bearer ', '');
    const decoded = await this.authService.getUserByJwtToken(token);

    if (!decoded || decoded.sub !== id) throw new UnauthorizedException();

    return this.usersService.remove(id);
  }
}

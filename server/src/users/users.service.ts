import {
  HttpException,
  Injectable,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { exec } from 'child_process';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto): Promise<User[]> {
    const { limit, offset } = paginationQuery;
    return await this.userModel.find().limit(limit).skip(offset).exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    // await user.populate('messages').execPopulate();

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<any> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });

      const { _id, name, email } = await user.save();

      return { _id, name, email };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();

      if (!user) {
        throw new NotFoundException(`User #${id} not found`);
      }

      return user;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id).exec();

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email }).exec();

    if (user) {
      return user;
    }
  }
}

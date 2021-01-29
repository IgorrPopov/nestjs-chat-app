import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './entities/message.entity';
import { Model } from 'mongoose';

import { ONE_HOUR_IN_MILLISECONDS } from './config/chat.config';

import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const message = new this.messageModel(createMessageDto);

    await message.save();
    await message.populate('owner').execPopulate();

    return message;
  }

  async getAllMessages(): Promise<Message[]> {
    const date = new Date(Date.now() - ONE_HOUR_IN_MILLISECONDS);

    const messages = await this.messageModel
      .find({
        createdAt: { $gt: date },
      })
      .populate('owner', '_id name email')
      .sort({ createdAt: 1 })
      .exec();

    return messages;
  }
}

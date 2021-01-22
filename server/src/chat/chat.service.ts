import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './entities/message.entity';
import { Model } from 'mongoose';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  async createMessage(text, owner): Promise<Message> {
    const message = new this.messageModel({ text, owner });

    await message.save();

    await message.populate('owner').execPopulate();

    return message;
  }

  async getAllMessages(): Promise<Message[]> {
    const messages = await this.messageModel.find().exec();

    if (messages.length > 0) {
      return await Promise.all(
        messages.map((message) => {
          return message.populate('owner').execPopulate();
        }),
      );
    }

    return messages;
  }
}

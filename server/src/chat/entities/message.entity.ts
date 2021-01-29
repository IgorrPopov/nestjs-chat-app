import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { MIN_MESSAGE_LENGTN, MAX_MESSAGE_LENGTH } from '../config/chat.config';

@Schema()
export class Message extends Document {
  @Prop({
    required: true,
    trim: true,
    minlength: MIN_MESSAGE_LENGTN,
    maxlength: MAX_MESSAGE_LENGTH,
  })
  text: string;

  @Prop({
    required: true,
  })
  owner: string;
}

const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.set('timestamps', true);
MessageSchema.add({
  owner: { type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' },
});

export { MessageSchema };

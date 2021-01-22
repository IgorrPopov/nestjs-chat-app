import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Message extends Document {
  @Prop({
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 10000,
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

import { BadRequestException } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import {
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '../config/user.config';

@Schema()
export class User extends Document {
  @Prop({
    required: true,
    trim: true,
    minlength: MIN_USERNAME_LENGTH,
    maxlength: MAX_USERNAME_LENGTH,
    // validate(value: string) {
    //   if (!value.match(/^[\w -]$/)) {
    //     throw new BadRequestException(
    //       'name must contain only English letters, numbers, hyphens, spaces and underscores',
    //     );
    //   }
    // },
  })
  name: string;

  @Prop({
    unique: true,
  })
  email: string;

  @Prop()
  password: string;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'owner',
});

UserSchema.set('toJSON', { virtuals: true });

// UserSchema.add({
//   messages: [{ type: MongooseSchema.Types.ObjectId, ref: 'Message' }],
// });

export { UserSchema };

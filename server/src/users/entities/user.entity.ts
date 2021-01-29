import { BadRequestException } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import validator from 'validator';

import {
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MAX_EMAIL_LENGTH,
} from '../config/user.config';

@Schema()
export class User extends Document {
  @Prop({
    required: true,
    trim: true,
    minlength: MIN_USERNAME_LENGTH,
    maxlength: MAX_USERNAME_LENGTH,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
    maxlength: MAX_EMAIL_LENGTH,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new BadRequestException(`Email "${value}" is invalid!`);
      }
    },
  })
  email: string;

  @Prop({
    required: true,
    minlength: MIN_PASSWORD_LENGTH,
    maxlength: MAX_PASSWORD_LENGTH,
  })
  password: string;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'owner',
});

UserSchema.set('toJSON', { virtuals: true });

UserSchema.set('timestamps', true);

UserSchema.methods.toJSON = function () {
  const user = this;

  const userObject = Object.assign(
    {
      createdAt: undefined,
      updatedAt: undefined,
    },
    user.toObject(),
  );

  delete userObject.password;
  delete userObject.__v;
  delete userObject.updatedAt;
  delete userObject.createdAt;

  return userObject;
};

export { UserSchema };

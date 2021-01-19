import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  MAX_USERNAME_LENGTH,
  MIN_USERNAME_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '../config/user.config';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(MAX_USERNAME_LENGTH, {
    message: `name is to long, max name length is ${MAX_USERNAME_LENGTH}`,
  })
  @MinLength(MIN_USERNAME_LENGTH, {
    message: `name is to short, min name length is ${MIN_USERNAME_LENGTH}`,
  })
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(MAX_PASSWORD_LENGTH, {
    message: `password is to long, max password length is ${MAX_PASSWORD_LENGTH}`,
  })
  @MinLength(MIN_PASSWORD_LENGTH, {
    message: `password is to short, min password length is ${MIN_PASSWORD_LENGTH}`,
  })
  readonly password: string;
}

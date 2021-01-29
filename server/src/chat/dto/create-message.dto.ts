import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { MIN_MESSAGE_LENGTN, MAX_MESSAGE_LENGTH } from '../config/chat.config';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(MAX_MESSAGE_LENGTH)
  @MinLength(MIN_MESSAGE_LENGTN)
  readonly text: string;

  @IsNotEmpty()
  @IsString()
  readonly owner: string;
}

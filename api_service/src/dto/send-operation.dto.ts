import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SendOperationDto {
  @ApiProperty({
    example: 'Hello World!',
    description: 'The message of the operation',
  })
  @IsString()
  @IsNotEmpty()
  readonly message: string;
}

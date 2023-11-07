import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetOperationStatusDto {
  @ApiProperty({
    example: 'somestring',
    description: 'The id of an operation',
  })
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}

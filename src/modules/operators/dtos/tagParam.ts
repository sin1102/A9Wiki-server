import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class tagParam {
  @ApiProperty()
  tag1: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  tag2: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  tag3: string;
}

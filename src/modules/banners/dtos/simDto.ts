import { ApiProperty } from '@nestjs/swagger';

export class simDto {
  @ApiProperty()
  timesPull: number;

  @ApiProperty()
  count: number;

  @ApiProperty()
  countPity: number;

  @ApiProperty()
  sixStarRate: number;

  @ApiProperty()
  have6Star: boolean;

  @ApiProperty()
  have5Star: boolean;
}

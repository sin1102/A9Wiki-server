import { ApiProperty } from '@nestjs/swagger';

export class opDtos {
  @ApiProperty()
  opId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  rarity: number;

  @ApiProperty()
  class: string[];

  @ApiProperty()
  icon: string;
}

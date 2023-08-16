import { ApiProperty } from '@nestjs/swagger';
import { Operators } from 'src/modules/operators/schemas/operators.schema';

export class pullResultsDto {
  @ApiProperty()
  pullCount: number;

  @ApiProperty()
  countPity: number;

  @ApiProperty()
  have6Star: boolean;

  @ApiProperty()
  have5Star: boolean;

  @ApiProperty()
  sixStarRate: number;

  @ApiProperty()
  ops: Operators[];
}

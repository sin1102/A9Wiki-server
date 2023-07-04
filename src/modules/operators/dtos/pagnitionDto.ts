import { ApiProperty } from '@nestjs/swagger';

export class pagnitionDto {
  @ApiProperty()
  resPerPage: string;

  @ApiProperty()
  currPage: string;

  @ApiProperty({
    required: false,
  })
  opName: string;
}

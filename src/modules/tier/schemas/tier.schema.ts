import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { opDtos } from 'src/modules/operators/dtos/opDtos';

export type TierDocument = Tier & Document;

@Schema()
export class Tier {
  @ApiProperty()
  @Prop({ type: Array })
  classes: string[];

  @ApiProperty()
  @Prop({ type: Array })
  tiers: { tier: string; ops: { op: opDtos; explain: string[] }[] }[];
}

export const TierSchema = SchemaFactory.createForClass(Tier);

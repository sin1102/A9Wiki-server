import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type BannersDocument = Banners & Document;

@Schema()
export class Banners {
  @ApiProperty()
  @Prop({ type: String })
  thumbnail: string;

  @ApiProperty()
  @Prop({ type: String })
  name: string;

  @ApiProperty()
  @Prop({ type: String })
  cnDate: string;

  @ApiProperty()
  @Prop({ type: String })
  globDate: string;

  @ApiProperty()
  @Prop({ type: String })
  bannerType: string;

  @ApiProperty()
  @Prop({ type: String })
  rateUpType: string;

  @ApiProperty()
  @Prop({ type: [Types.ObjectId], ref: 'Operators' })
  rateUp: Types.ObjectId[];

  @ApiProperty()
  @Prop({ type: [Types.ObjectId], ref: 'Operators' })
  offRate: Types.ObjectId[];
}

export const BannersSchema = SchemaFactory.createForClass(Banners);

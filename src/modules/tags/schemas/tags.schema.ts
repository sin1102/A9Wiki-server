import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TagsDocument = Tags & Document;

@Schema()
export class Tags {
  @ApiProperty()
  @Prop({ type: Array })
  tagname: string[];

  @ApiProperty()
  @Prop({ type: String })
  category: string;
}

export const TagsSchema = SchemaFactory.createForClass(Tags);

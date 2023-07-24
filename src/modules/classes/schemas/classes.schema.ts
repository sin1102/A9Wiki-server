import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ClassesDocument = Classes & Document;

@Schema()
export class Classes {
  @ApiProperty()
  @Prop({ type: String })
  name: string;

  @ApiProperty()
  @Prop({ type: String })
  icon: string;

  @ApiProperty()
  @Prop({ type: Array })
  subClass: { name: string; icon: string }[];
}

export const ClassesSchema = SchemaFactory.createForClass(Classes);

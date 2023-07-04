import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type OperatorsDocument = Operators & Document;
@Schema({
  timestamps: true,
})
export class Operators {
  @ApiProperty({ type: String, required: false })
  @Prop({ type: String })
  opId: string;

  @ApiProperty()
  @Prop({ type: String })
  name: string;

  @ApiProperty()
  @Prop({ type: String })
  icon: string;

  @ApiProperty()
  @Prop({ type: Number })
  rarity: number;

  @ApiProperty()
  @Prop({ type: String })
  alter: string;

  @ApiProperty()
  @Prop({ type: String })
  va: string;

  @ApiProperty()
  @Prop({ type: String })
  attack_type: string;

  @ApiProperty()
  @Prop({ type: String })
  biography: string;

  @ApiProperty()
  @Prop({ type: String })
  description: string;

  @ApiProperty()
  @Prop({ type: String })
  quote: string;

  @ApiProperty()
  @Prop({ type: Map })
  voicelines: { [key: string]: string };

  @ApiProperty()
  @Prop({ type: Map })
  lore: { [key: string]: string };

  @ApiProperty()
  @Prop({ type: Array })
  affiliation: Array<string>;

  @ApiProperty()
  @Prop({ type: String })
  classIcon: string;

  @ApiProperty()
  @Prop({ type: String })
  faction: string;

  @ApiProperty()
  @Prop({ type: Array })
  class: Array<string>;

  @ApiProperty()
  @Prop({ type: Array })
  tags: Array<string>;

  @ApiProperty()
  @Prop({ type: Array })
  range: Array<{ elite: string; range: ('attackable' | 'unit' | 'null')[][] }>;

  @ApiProperty()
  @Prop({ type: Map })
  statistics:
    | {
        [key: string]: {
          hp: string;
          atk: string;
          def: string;
          block: string;
          resist?: string;
          deploy?: string;
          cost?: string;
          interval?: string;
        };
      }
    | {
        base: { error: string };
        e0max: { error: string };
        e1max: { error: string };
        e2max: { error: string };
      };

  @ApiProperty()
  @Prop({ type: String })
  trait: string;

  @ApiProperty()
  @Prop({ type: Array })
  costs: { icon: string; name: string; amount: number }[];

  @ApiProperty()
  @Prop({ type: Array })
  potential: Array<{ name: string; value: string }>;

  @ApiProperty()
  @Prop({ type: Array })
  trust: { name: string; value: string };

  @ApiProperty()
  @Prop({ type: Array })
  talents: Array<{
    elite: string;
    potential: string;
    talentName: string;
    description: string;
  }>;

  @ApiProperty()
  @Prop({ type: Array })
  skills: Array<{
    name: string;
    variations: {
      level: string | number;
      description: string;
      sp_cost: string;
      initial_sp: string;
      duration: string;
      range: string | ('attackable' | 'unit' | 'null')[][];
    }[];
    skill_charge: string;
    skill_activation: string;
  }>;

  @ApiProperty()
  @Prop({ type: Array })
  module: Array<{ [key: string]: any }>;

  @ApiProperty()
  @Prop({ type: Array })
  baseskill: Array<{
    name: string;
    level: string;
    effects: string;
    building: string;
  }>;

  @ApiProperty()
  @Prop({ type: Boolean })
  headhunting: boolean;

  @ApiProperty()
  @Prop({ type: Boolean })
  recruitable: boolean;

  @ApiProperty()
  @Prop({ type: Boolean })
  Limited: boolean;

  @ApiProperty()
  @Prop({ type: Array })
  art: Array<{ name: string; link: string }>;

  @ApiProperty()
  @Prop({ type: Array })
  availability: string;

  @ApiProperty()
  release_dates: { cn: string; global: string };

  @ApiProperty()
  @Prop({ type: String })
  url: string;

  @ApiProperty()
  @Prop({ type: Number, timestamp: true })
  dateAdded?: number;
}

export const OperatorsSchema = SchemaFactory.createForClass(Operators);

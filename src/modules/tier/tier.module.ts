import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tier, TierSchema } from './schemas/tier.schema';
import { TierControler } from './tier.controller';
import { TierService } from './tier.service';
import {
  Operators,
  OperatorsSchema,
} from '../operators/schemas/operators.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tier.name, schema: TierSchema },
      { name: Operators.name, schema: OperatorsSchema },
    ]),
  ],
  controllers: [TierControler],
  providers: [TierService],
  exports: [TierService],
})
export class TierModule {}

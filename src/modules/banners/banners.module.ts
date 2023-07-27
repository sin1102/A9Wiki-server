import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Banners, BannersSchema } from './schemas/banners.schemas';
import { BannersControler } from './banners.controller';
import { BannersService } from './banners.service';
import {
  Operators,
  OperatorsSchema,
} from '../operators/schemas/operators.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Banners.name, schema: BannersSchema },
      { name: Operators.name, schema: OperatorsSchema },
    ]),
  ],
  controllers: [BannersControler],
  providers: [BannersService],
  exports: [BannersService],
})
export class BannersModule {}

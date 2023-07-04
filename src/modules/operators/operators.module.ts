import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OperatorsService } from './operators.service';
import { OperatorsControler } from './operators.controller';
import { OperatorsSchema, Operators } from './schemas/operators.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Operators.name, schema: OperatorsSchema },
    ]),
  ],
  controllers: [OperatorsControler],
  providers: [OperatorsService],
  exports: [OperatorsService],
})
export class OperatorsModule {}

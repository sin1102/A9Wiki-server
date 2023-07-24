import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Classes, ClassesSchema } from './schemas/classes.schema';
import { ClassesControler } from './classes.controller';
import { ClassesService } from './classes.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Classes.name, schema: ClassesSchema }]),
  ],
  controllers: [ClassesControler],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tags, TagsSchema } from './schemas/tags.schema';
import { TagsControler } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tags.name, schema: TagsSchema }]),
  ],
  controllers: [TagsControler],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}

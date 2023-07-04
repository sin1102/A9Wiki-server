import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tags, TagsDocument } from './schemas/tags.schema';
import { getTags } from 'src/utils/getTags';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tags.name)
    private tagsModel: Model<TagsDocument>,
  ) {}

  async scrapeTags() {
    const data = await getTags();
    const tags = data.map((t) => {
      const ta = new Tags();
      ta.category = t.category;
      ta.tagname = t.tagName;
      return ta;
    });
    for (let i = 0; i < tags.length; i++) {
      const tag = await this.tagsModel.findOne({
        category: tags[i].category,
      });
      if (tag) {
        await this.tagsModel.findOneAndUpdate(
          { category: tags[i].category },
          tags[i],
        );
      } else {
        await this.tagsModel.create(tags[i]);
      }
    }
    return tags;
  }

  async findAll(): Promise<Tags[]> {
    return await this.tagsModel.find().select({ __v: 0, _id: 0 });
  }
}

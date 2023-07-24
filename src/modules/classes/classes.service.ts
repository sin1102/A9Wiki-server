import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Classes, ClassesDocument } from './schemas/classes.schema';
import { getClasses } from 'src/utils/getClasses';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(Classes.name)
    private classesModel: Model<ClassesDocument>,
  ) {}

  async scrapeClasses() {
    const data = await getClasses();
    const tags = data.map((t) => {
      const ta = new Classes();
      ta.name = t.name;
      ta.icon = t.icon;
      ta.subClass = t.subClass;
      return ta;
    });
    for (let i = 0; i < tags.length; i++) {
      const tag = await this.classesModel.findOne({
        class: tags[i].name,
      });
      if (tag) {
        await this.classesModel.findOneAndUpdate(
          { class: tags[i].name },
          tags[i],
        );
      } else {
        await this.classesModel.create(tags[i]);
      }
    }
    return tags;
  }

  async findAll(): Promise<Classes[]> {
    return await this.classesModel.find().select({ __v: 0, _id: 0 });
  }
}

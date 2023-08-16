import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getTier } from 'src/utils/getTierList';
import { Tier, TierDocument } from './schemas/tier.schema';
import {
  Operators,
  OperatorsDocument,
} from '../operators/schemas/operators.schema';
import { opDtos } from '../operators/dtos/opDtos';

@Injectable()
export class TierService {
  constructor(
    @InjectModel(Tier.name)
    private tierModel: Model<TierDocument>,
    @InjectModel(Operators.name)
    private operatorsModel: Model<OperatorsDocument>,
  ) {}

  async scrapeTier() {
    const data = await getTier();

    for (let i = 0; i < data.length; i++) {
      const tier = new Tier();
      tier.classes = data[i].clas;
      tier.tiers = [];
      for (let j = 0; j < data[i].tier.length; j++) {
        const ti = data[i].tier[j].tier;
        const o = [];
        for (let k = 0; k < data[i].tier[j].ops.length; k++) {
          const op: opDtos = await this.operatorsModel
            .findOne({ opId: data[i].tier[j].ops[k].name })
            .select({
              opId: 1,
              name: 1,
              rarity: 1,
              icon: 1,
              classIcon: 1,
              subClassIcon: 1,
              _id: 0,
            });
          o.push({ op: op, explain: data[i].tier[j].ops[k].explain });
        }
        tier.tiers.push({ tier: ti, ops: o });
      }
      await this.tierModel.create(tier);
    }
    return data;
  }

  async findAll(): Promise<Tier[]> {
    // const sortOrder = ['EX', 'S', 'A', 'B', 'C', 'D', 'E', 'X'];

    // return await this.tierModel.aggregate([
    //   {
    //     $addFields: {
    //       tierOrder: { $indexOfArray: [sortOrder, '$tiers.tier'] },
    //     },
    //   },
    //   { $unwind: '$tiers' },
    //   { $sort: { tierOrder: 1 } },
    //   {
    //     $group: {
    //       _id: '$_id',
    //       classes: { $first: '$classes' },
    //       tiers: { $push: '$tiers' },
    //     },
    //   },
    // ]);
    return await this.tierModel.find();
  }
}

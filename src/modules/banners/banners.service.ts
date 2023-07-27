import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banners, BannersDocument } from './schemas/banners.schemas';
import { GetBanners } from 'src/utils/getBanners';
import {
  Operators,
  OperatorsDocument,
} from '../operators/schemas/operators.schema';
@Injectable()
export class BannersService {
  constructor(
    @InjectModel(Banners.name)
    private bannersModel: Model<BannersDocument>,
    @InjectModel(Operators.name)
    private operatorsModel: Model<OperatorsDocument>,
  ) {}

  async scrapeBanners() {
    const data = await GetBanners();
    for (let i = 0; i < data.length; i++) {
      const banner = new Banners();
      banner.name = data[i].name;
      banner.thumbnail = data[i].thumbnail;
      banner.cnDate = data[i].cnDate;
      banner.globDate = data[i].globDate;
      let count = 0;
      let offrate = false;
      let datemax = new Date();
      banner.offRate = [];
      banner.rateUp = [];
      const listOp: Array<Operators> = [];
      if (data[i].ops.length != 0) {
        for (let j = 0; j < data[i].ops.length; j++) {
          const op = await this.operatorsModel.findOne({
            opId: data[i].ops[j],
          });
          if (op) {
            listOp.push(op);
            if (op.Limited) {
              banner.rateUpType = 'limited';
              offrate = true;
            } else {
              if (banner.rateUpType != 'limited') {
                banner.rateUpType = 'normal';
              }
            }
            if (op.rarity == 6) {
              count++;
            }

            if (j == 0) {
              datemax = new Date(op.release_dates.cn);
            } else {
              const currOpRelease = new Date(op.release_dates.cn);
              if (currOpRelease > datemax) {
                datemax = currOpRelease;
              }
            }
          }
        }

        if (offrate) {
          for (let i = 0; i < listOp.length; i++) {
            const currOpRelease = new Date(listOp[i].release_dates.cn);
            if (currOpRelease < datemax) {
              banner.offRate.push(listOp[i]._id);
            } else {
              banner.rateUp.push(listOp[i]._id);
            }
          }
        } else {
          for (let i = 0; i < listOp.length; i++) {
            banner.rateUp.push(listOp[i]._id);
          }
        }
        switch (count) {
          case 1:
            banner.bannerType = 'single-rateup';
            break;
          case 2:
            banner.bannerType = 'double-rateup';
            break;
          case 4:
            banner.bannerType = 'join operation';
          default:
            break;
        }
        const b = await this.bannersModel.findOne({ name: banner.name });
        if (b) {
          await this.bannersModel.findOneAndUpdate(
            { name: banner.name },
            banner,
          );
        } else await this.bannersModel.create(banner);
      }
    }
    return data;
  }

  async findAll(): Promise<Banners[]> {
    return await this.bannersModel.find().select({ __v: 0, _id: 0 });
  }
}

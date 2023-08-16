import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banners, BannersDocument } from './schemas/banners.schemas';
import { GetBanners } from 'src/utils/getBanners';
import {
  Operators,
  OperatorsDocument,
} from '../operators/schemas/operators.schema';
import { simDto } from './dtos/simDto';
import { randomInt } from 'crypto';
import { pullResultsDto } from './dtos/pullResultsDto';
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

  async findOne(name: string) {
    return await this.bannersModel
      .findOne({ name: name })
      .populate({
        path: 'rateUp',
        select: ['opId', 'name', 'rarity', 'class', 'icon', 'classIcon'],
      })
      .populate({
        path: 'offRate',
        select: ['opId', 'name', 'rarity', 'class', 'icon', 'classIcon'],
      });
  }

  async simulation(banner: string, pulls: simDto): Promise<pullResultsDto> {
    const bann = await this.bannersModel.findOne({ name: banner }).exec();
    const ops = [];
    if (bann) {
      let cnDate = [];
      let globDate = [];
      if (bann.cnDate != 'only global') {
        cnDate = bann.cnDate.replaceAll('CN:', '').split('~');
      } else {
        globDate = bann.globDate.replaceAll('Global:', '').split('~');
      }
      let maxDate = new Date();
      let opsPol: Operators[] = [];
      if (cnDate.length > 0) {
        maxDate = new Date(cnDate[0]);
        opsPol = await this.operatorsModel
          .find({
            rarity: { $gt: 2 },
            Limited: false,
          })
          .select({
            opId: 1,
            name: 1,
            rarity: 1,
            class: 1,
            icon: 1,
            classIcon: 1,
            release_dates: 1,
          })
          .then((op) =>
            op.filter((o) => new Date(o.release_dates.cn) <= maxDate),
          );
      } else {
        maxDate = new Date(globDate[0]);
        opsPol = await this.operatorsModel
          .find({
            rarity: { $gt: 2 },
            Limited: false,
            headhunting: true,
          })
          .select({
            opId: 1,
            name: 1,
            rarity: 1,
            class: 1,
            icon: 1,
            classIcon: 1,
            release_dates: 1,
          })
          .then((op) =>
            op.filter((o) => new Date(o.release_dates.global) <= maxDate),
          );
      }
      const rateUp: Operators[] = [];
      const offRate: Operators[] = [];
      if (bann.offRate.length != 0) {
        for (let i = 0; i < bann.offRate.length; i++) {
          offRate.push(opsPol.find((op) => op._id.equals(bann.offRate[i]._id)));
          opsPol = opsPol.filter((op) => !op._id.equals(bann.offRate[i]._id));
        }
      }
      for (let i = 0; i < bann.rateUp.length; i++) {
        rateUp.push(opsPol.find((op) => op._id.equals(bann.rateUp[i]._id)));
        opsPol = opsPol.filter((op) => !op._id.equals(bann.rateUp[i]._id));
      }
      let sixStarRate = pulls.sixStarRate;
      let fiveStarRate = sixStarRate + 10;
      let fourStarRate = fiveStarRate + 60;
      const sixPol = opsPol.filter((op) => op.rarity == 6);
      const sixRange = sixPol.length;
      const fivePol = opsPol.filter((op) => op.rarity == 5);
      const fiveRange = fivePol.length;
      const fourPol = opsPol.filter((op) => op.rarity == 4);
      const fourRange = fourPol.length;
      const threePol = opsPol.filter((op) => op.rarity == 3);
      const threeRange = threePol.length;
      const sixRateUpPol = rateUp.filter((op) => op.rarity == 6);
      const fiveRateUpPol = rateUp.filter((op) => op.rarity == 5);
      let have6Star = pulls.have6Star;
      let have5Star = pulls.have5Star;
      let countPity = pulls.countPity;
      let pullCount = pulls.count;
      if (sixStarRate == 2 && pullCount > 50) {
        sixStarRate = 2 + 2 * (pullCount - 50);
      }
      for (let i = 1; i <= pulls.timesPull; i++) {
        pullCount++;
        if (
          pullCount == 10 &&
          have5Star.toString() == 'false' &&
          have6Star.toString() == 'false'
        ) {
          const randRate = randomInt(1, 100);
          if (randRate <= 2) {
            const rand = randomInt(1, 100);
            if (rand <= 50) {
              ops.push(sixRateUpPol[0]);
            } else if (offRate.length > 0) {
              const randOff = randomInt(1, 100);
              if (randOff <= 70) {
                const randOp = randomInt(0, offRate.length - 1);
                ops.push(offRate[randOp]);
              } else {
                const randOp = randomInt(0, sixRange - 1);
                ops.push(sixPol[randOp]);
              }
            } else {
              const randOp = randomInt(0, sixRange - 1);
              ops.push(sixPol[randOp]);
            }
            have6Star = true;
            countPity = 0;
            sixStarRate = 2;
            fiveStarRate = 10;
            fourStarRate = 60;
          } else {
            const rand = randomInt(1, 100);
            if (rand <= 50) {
              const randOp = randomInt(0, fiveRateUpPol.length - 1);
              ops.push(fiveRateUpPol[randOp]);
            } else {
              const randOp = randomInt(0, fiveRange - 1);
              ops.push(fivePol[randOp]);
            }
            countPity++;
            have5Star = true;
          }
        } else if (countPity > 50) {
          sixStarRate += 2;
          fiveStarRate += 2;
          fourStarRate += 2;
          const randRate = randomInt(1, 100);
          if (randRate <= sixStarRate) {
            const rand = randomInt(1, 100);
            if (rand <= 50) {
              ops.push(sixRateUpPol[0]);
            } else if (offRate.length > 0) {
              const randOff = randomInt(1, 100);
              if (randOff <= 70) {
                const randOp = randomInt(0, offRate.length - 1);
                ops.push(offRate[randOp]);
              } else {
                const randOp = randomInt(0, sixRange - 1);
                ops.push(sixPol[randOp]);
              }
            } else {
              const randOp = randomInt(0, sixRange - 1);
              ops.push(sixPol[randOp]);
            }
            have6Star = true;
            sixStarRate = 2;
            fiveStarRate = 10;
            fourStarRate = 60;
            countPity = 0;
          } else if (randRate > sixStarRate && randRate <= fiveStarRate) {
            const rand = randomInt(1, 100);
            if (rand <= 50) {
              ops.push(fiveRateUpPol[0]);
            } else {
              const randOp = randomInt(0, fiveRange - 1);
              ops.push(fivePol[randOp]);
            }
            countPity++;
          } else if (randRate > fiveStarRate && randRate <= fourStarRate) {
            const randOp = randomInt(0, fourRange - 1);
            ops.push(fourPol[randOp]);
            countPity++;
          } else {
            const randOp = randomInt(0, threeRange - 1);
            ops.push(threePol[randOp]);
            countPity++;
          }
        } else {
          const randRate = randomInt(1, 100);
          if (randRate <= sixStarRate) {
            const rand = randomInt(1, 100);
            if (rand <= 50) {
              ops.push(sixRateUpPol[0]);
            } else if (offRate.length > 0) {
              const randOff = randomInt(1, 100);
              if (randOff <= 70) {
                const randOp = randomInt(0, offRate.length - 1);
                ops.push(offRate[randOp]);
              } else {
                const randOp = randomInt(0, sixRange - 1);
                ops.push(sixPol[randOp]);
              }
            } else {
              const randOp = randomInt(0, sixRange - 1);
              ops.push(sixPol[randOp]);
            }
            have6Star = true;
            sixStarRate = 2;
            fiveStarRate = 10;
            fourStarRate = 60;
            countPity = 0;
          } else if (randRate > sixStarRate && randRate <= fiveStarRate) {
            const rand = randomInt(1, 100);
            if (pullCount < 10) {
              have5Star = true;
            }
            if (rand <= 50) {
              ops.push(fiveRateUpPol[0]);
            } else {
              const randOp = randomInt(0, fiveRange - 1);
              ops.push(fivePol[randOp]);
            }
            countPity++;
          } else if (randRate > fiveStarRate && randRate <= fourStarRate) {
            const randOp = randomInt(0, fourRange - 1);
            ops.push(fourPol[randOp]);
            countPity++;
          } else {
            const randOp = randomInt(0, threeRange - 1);
            ops.push(threePol[randOp]);
            countPity++;
          }
        }
      }
      const result: pullResultsDto = {
        pullCount: pullCount,
        countPity: countPity,
        have5Star: have5Star,
        have6Star: have6Star,
        sixStarRate: sixStarRate,
        ops: ops,
      };
      return result;
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Operators, OperatorsDocument } from './schemas/operators.schema';
import { getOps } from 'src/utils/getOps';
import { opsDetail } from 'src/utils/getOpsDetail';
import { tagParam } from './dtos/tagParam';
import { pagnitionDto } from './dtos/pagnitionDto';
import { opDtos } from './dtos/opDtos';

@Injectable()
export class OperatorsService {
  constructor(
    @InjectModel(Operators.name)
    private operatosModel: Model<OperatorsDocument>,
  ) {}
  async scrapeOp() {
    const count = [0, 0, 0];
    const opList = await getOps();
    for (let i = 0; i < opList.length; i++) {
      const op = await this.operatosModel.findOne({ opId: opList[i].name });
      console.log(opList[i]);
      if (op) {
        const updateInfo = await opsDetail(
          `https://gamepress.gg/arknights/operator/${opList[i].name}`,
        );
        updateInfo.icon = opList[i].icon;
        updateInfo.classIcon = opList[i].classIcon;
        await this.operatosModel.findOneAndReplace(
          { opId: opList[i].name },
          updateInfo,
        );
        count[0]++;
        console.log('update: ' + count[0]);
      } else {
        const createdOperator: Operators = await opsDetail(
          `https://gamepress.gg/arknights/operator/${opList[i].name}`,
        );
        createdOperator.icon = opList[i].icon;
        createdOperator.classIcon = opList[i].classIcon;
        await this.operatosModel.create(createdOperator);
        count[1]++;
        console.log('create: ' + count[1]);
      }
    }

    return { updated: count[0], created: count[1] };
  }
  async findById(id: string): Promise<Operators> {
    const op = await this.operatosModel
      .findOne({ opId: id })
      .select({ __v: 0, _id: 0 });
    if (!op) throw new NotFoundException();
    return op;
  }

  async findByName(name: string): Promise<Operators> {
    const op = await this.operatosModel
      .findOne({ name: name })
      .select({ __v: 0, _id: 0 });
    if (!op) throw new NotFoundException();
    return op;
  }

  async recruit(tag: tagParam): Promise<Operators[]> {
    const tags = [tag.tag1];
    if (tag.tag2) {
      tags.push(tag.tag2);
    }
    if (tag.tag3) {
      tags.push(tag.tag3);
    }
    let recruitList: Operators[] = [];
    if (!tags.includes('top operator')) {
      if (!tags.includes('senior operator')) {
        recruitList = await this.operatosModel
          .find({
            tags: { $all: tags },
            rarity: { $ne: 6 },
            recruitable: true,
          })
          .select({
            opId: 1,
            name: 1,
            class: 1,
            rarity: 1,
            tags: 1,
            icon: 1,
            _id: 0,
          });
      } else {
        const index = tags.indexOf('senior operator');
        tags.splice(index, 1);
        console.log(tags);
        if (tags.every((item) => item == undefined)) {
          recruitList = await this.operatosModel
            .find({
              rarity: 5,
              recruitable: true,
            })
            .select({
              opId: 1,
              name: 1,
              class: 1,
              rarity: 1,
              tags: 1,
              icon: 1,
              _id: 0,
            });
        } else {
          recruitList = await this.operatosModel
            .find({
              tags: { $all: tags },
              rarity: 5,
              recruitable: true,
            })
            .select({
              opId: 1,
              name: 1,
              class: 1,
              rarity: 1,
              tags: 1,
              icon: 1,
              _id: 0,
            });
        }
      }
    } else {
      const index = tags.indexOf('top operator');
      tags.splice(index, 1);
      console.log(tags);
      if (tags.every((item) => item == undefined)) {
        recruitList = await this.operatosModel
          .find({
            rarity: 6,
            recruitable: true,
          })
          .select({
            opId: 1,
            name: 1,
            class: 1,
            rarity: 1,
            tags: 1,
            icon: 1,
            _id: 0,
          });
      } else {
        recruitList = await this.operatosModel
          .find({
            tags: { $all: tags },
            rarity: 6,
            recruitable: true,
          })
          .select({
            opId: 1,
            name: 1,
            class: 1,
            rarity: 1,
            tags: 1,
            icon: 1,
            _id: 0,
          });
      }
    }
    return recruitList;
  }
  async findAll(query: pagnitionDto): Promise<opDtos[]> {
    const currentPage = Number(query.currPage) || 1;
    const resPerPage = Number(query.resPerPage) || 5;
    const skip = resPerPage * (currentPage - 1);
    const keyword = query.opName
      ? {
          name: {
            $regex: query.opName,
            $options: 'i',
          },
        }
      : {};
    const ops = await this.operatosModel
      .find({ ...keyword })
      .select({
        opId: 1,
        name: 1,
        class: 1,
        rarity: 1,
        tags: 1,
        icon: 1,
        classIcon: 1,
        _id: 0,
      })
      .limit(resPerPage)
      .skip(skip);
    return ops;
  }
}

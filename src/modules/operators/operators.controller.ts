import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OperatorsService } from './operators.service';
import { Operators } from './schemas/operators.schema';
import { nameParam } from 'src/modules/operators/dtos/nameParam';
import { tagParam } from './dtos/tagParam';
import { pagnitionDto } from './dtos/pagnitionDto';
import { opDtos } from './dtos/opDtos';

@ApiTags('Operator')
@Controller('operators')
export class OperatorsControler {
  constructor(private readonly operatorsService: OperatorsService) {}
  @ApiOkResponse({ description: 'ok' })
  @ApiOperation({ summary: 'Scrape operator' })
  @Post()
  async scrape() {
    const res = await this.operatorsService.scrapeOp();
    return res;
  }

  @ApiOkResponse({ type: Operators, description: 'ok' })
  @ApiOperation({ summary: 'Find operator by name' })
  @Get(':name')
  async findByName(@Param() nameParam: nameParam): Promise<Operators> {
    const op = await this.operatorsService.findByName(nameParam.name);
    return op;
  }

  @ApiOkResponse({ type: Operators, description: 'ok' })
  @ApiOperation({ summary: 'Recruit' })
  @Get('/recruit/:tag')
  async recruit(@Query() param: tagParam): Promise<Operators[]> {
    const list = await this.operatorsService.recruit(param);
    return list;
  }

  @ApiOkResponse({ type: Operators, description: 'ok' })
  @ApiOperation({ summary: 'Get list operators' })
  @Get()
  async findAll(@Query() pagnitionDto: pagnitionDto): Promise<opDtos[]> {
    return await this.operatorsService.findAll(pagnitionDto);
  }
}

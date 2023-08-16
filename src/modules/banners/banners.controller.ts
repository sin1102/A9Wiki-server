import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BannersService } from './banners.service';
import { Banners } from './schemas/banners.schemas';
import { Operators } from '../operators/schemas/operators.schema';
import { simDto } from './dtos/simDto';
import { pullResultsDto } from './dtos/pullResultsDto';
@ApiTags('Banners')
@Controller('banners')
export class BannersControler {
  constructor(private readonly bannersService: BannersService) {}
  @ApiOkResponse({ description: 'ok' })
  @ApiOperation({ summary: 'Scrape banners' })
  @Post()
  async scrape() {
    const res = await this.bannersService.scrapeBanners();
    return res;
  }

  @ApiOkResponse({ description: 'ok' })
  @ApiOperation({ summary: 'Get all banners' })
  @Get()
  async findAll(): Promise<Banners[]> {
    return await this.bannersService.findAll();
  }

  @ApiOkResponse({ description: 'ok' })
  @ApiOperation({ summary: 'Get one banner' })
  @Get('/name/:Name')
  async findOne(@Param('Name') bannerName: string) {
    return await this.bannersService.findOne(bannerName);
  }

  @ApiOkResponse({ description: 'ok' })
  @ApiOperation({ summary: 'Gacha Simulation' })
  @Get(':bannerName')
  async simulation(
    @Param('bannerName') bannerName: string,
    @Query() pull: simDto,
  ): Promise<pullResultsDto> {
    return await this.bannersService.simulation(bannerName, pull);
  }
}

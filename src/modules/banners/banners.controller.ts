import { Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BannersService } from './banners.service';
import { Banners } from './schemas/banners.schemas';
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
}

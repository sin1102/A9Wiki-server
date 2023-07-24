import { Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TierService } from './tier.service';
import { Tier } from './schemas/tier.schema';

@ApiTags('Tier')
@Controller('tier')
export class TierControler {
  constructor(private readonly tierService: TierService) {}
  @ApiOkResponse({ description: 'ok' })
  @ApiOperation({ summary: 'Scrape tier' })
  @Post()
  async scrape() {
    const res = await this.tierService.scrapeTier();
    return res;
  }

  @ApiOkResponse({ description: 'ok' })
  @ApiOperation({ summary: 'Get all tier' })
  @Get()
  async findAll(): Promise<Tier[]> {
    return await this.tierService.findAll();
  }
}

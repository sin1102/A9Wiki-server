import { Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { Tags } from './schemas/tags.schema';

@ApiTags('Tag')
@Controller('tags')
export class TagsControler {
  constructor(private readonly tagsService: TagsService) {}
  @ApiOkResponse({ description: 'ok' })
  @ApiOperation({ summary: 'Scrape tags' })
  @Post()
  async scrape() {
    const res = await this.tagsService.scrapeTags();
    return res;
  }

  @ApiOkResponse({ description: 'ok' })
  @ApiOperation({ summary: 'Get all tags' })
  @Get()
  async findAll(): Promise<Tags[]> {
    return await this.tagsService.findAll();
  }
}

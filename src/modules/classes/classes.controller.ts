import { Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { Classes } from './schemas/classes.schema';

@ApiTags('Classes')
@Controller('classes')
export class ClassesControler {
  constructor(private readonly classesService: ClassesService) {}
  @ApiOkResponse({ description: 'ok' })
  @ApiOperation({ summary: 'Scrape classes' })
  @Post()
  async scrape() {
    const res = await this.classesService.scrapeClasses();
    return res;
  }

  @ApiOkResponse({ description: 'ok' })
  @ApiOperation({ summary: 'Get all classes' })
  @Get()
  async findAll(): Promise<Classes[]> {
    return await this.classesService.findAll();
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateCat } from '../models/dto/ICreateCatDTO';
import { CatsService } from '../service/cats.service';

@Controller('cats')
export class CatsController {
  constructor(private catSerive: CatsService) {}

  @Get()
  async listCat(): Promise<Array<CreateCat>> {
    return this.catSerive.findAll();
  }

  @Get(':id')
  async listCatName(@Param('id') id: string): Promise<CreateCat> {
    return this.catSerive.findById(id);
  }

  @Get('/owner/:id')
  async listCatsOwner(@Param('id') id: string): Promise<Array<CreateCat>> {
    return this.catSerive.findByOwner(id);
  }

  @Post()
  async createCat(@Body() cat: CreateCat): Promise<CreateCat> {
    return this.catSerive.create(cat);
  }

  @Put(':id')
  async updateCat(
    @Param('id') id: string,
    @Body() cat: CreateCat,
  ): Promise<CreateCat> {
    return this.catSerive.update(id, cat);
  }

  @Delete(':id')
  async deleteCat(@Param('id') id: string): Promise<string> {
    return this.catSerive.delete(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ICreateCatDTO } from '../models/dto/ICreateCatDTO';
import { CreateCatService } from '../service/CreateCat.service';
import { DeleteCatService } from '../service/DeleteCat.service';
import { ListCatService } from '../service/ListCat.service';
import { ListCatOwnerService } from '../service/ListCatOwner.service';
import { ListCatsService } from '../service/ListCats.service';
import { UpdateCatService } from '../service/UpdateCat.service';

@Controller('cats')
export class CatsController {
  constructor(
    private createCatService: CreateCatService,
    private listCatsService: ListCatsService,
    private listCatService: ListCatService,
    private listCatOwnerService: ListCatOwnerService,
    private updateCatService: UpdateCatService,
    private deleteCatService: DeleteCatService,
  ) {}

  @Get()
  async listCat(): Promise<Array<ICreateCatDTO>> {
    return this.listCatsService.execute();
  }

  @Get(':id')
  async listCatName(@Param('id') id: string): Promise<ICreateCatDTO> {
    return this.listCatService.execute(id);
  }

  @Get('/owner/:id')
  async listCatsOwner(@Param('id') id: string): Promise<Array<ICreateCatDTO>> {
    return this.listCatOwnerService.execute(id);
  }

  @Post()
  async createCat(@Body() cat: ICreateCatDTO): Promise<ICreateCatDTO> {
    return this.createCatService.execute(cat);
  }

  @Put(':id')
  async updateCat(
    @Param('id') id: string,
    @Body() cat: ICreateCatDTO,
  ): Promise<ICreateCatDTO> {
    return this.updateCatService.execute(id, cat);
  }

  @Delete(':id')
  async deleteCat(@Param('id') id: string): Promise<string> {
    return this.deleteCatService.execute(id);
  }
}

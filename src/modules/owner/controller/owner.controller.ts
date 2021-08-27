import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateOwner } from '../models/dto/ICreateOwnerDTO';
import { OwnerService } from '../service/owner.service';

@Controller('owner')
export class OwnerController {
  constructor(private ownerService: OwnerService) {}

  @Get()
  async listOwner(): Promise<Array<CreateOwner>> {
    return this.ownerService.findAll();
  }

  @Get(':id')
  async listOwnerById(@Param('id') id: string): Promise<CreateOwner> {
    return this.ownerService.findById(id);
  }

  @Post()
  async createOwner(@Body() owner: CreateOwner): Promise<CreateOwner> {
    return this.ownerService.create(owner);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() owner: CreateOwner,
  ): Promise<CreateOwner> {
    return this.ownerService.update(id, owner);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<string> {
    return this.ownerService.delete(id);
  }
}

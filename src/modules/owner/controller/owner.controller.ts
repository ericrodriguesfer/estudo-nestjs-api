import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ICreateOwnerDTO } from '../models/dto/ICreateOwnerDTO';
import { CreateOwnerService } from '../service/CreateOwner.service';
import { ListOwnerService } from '../service/ListOwner.service';
import { ListOwnersService } from '../service/ListOwners.service';
import { UpdateOwnerService } from '../service/UpdateOwner.service';
import { DeleteOwnerService } from '../service/DeleteOwner.service';

@Controller('owner')
export class OwnerController {
  constructor(
    private createOwnerService: CreateOwnerService,
    private listOwnerService: ListOwnerService,
    private listOwnersService: ListOwnersService,
    private updateOwnerService: UpdateOwnerService,
    private deleteOwnerService: DeleteOwnerService,
  ) {}

  @Get()
  async listOwner(): Promise<Array<ICreateOwnerDTO>> {
    return this.listOwnersService.execute();
  }

  @Get(':id')
  async listOwnerById(@Param('id') id: string): Promise<ICreateOwnerDTO> {
    return this.listOwnerService.execute(id);
  }

  @Post()
  async createOwner(@Body() owner: ICreateOwnerDTO): Promise<ICreateOwnerDTO> {
    return this.createOwnerService.execute(owner);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() owner: ICreateOwnerDTO,
  ): Promise<ICreateOwnerDTO> {
    return this.updateOwnerService.execute(id, owner);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<string> {
    return this.deleteOwnerService.execute(id);
  }
}

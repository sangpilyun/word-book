import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateAuthDto } from 'src/dto/create-auth.dto';
import { UpdateAuthDto } from 'src/dto/update-auth.dto';
import { AuthorizationService } from './authorization.service';

@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authorizationService.create(createAuthDto);
  }

  @Get()
  findName(@Query() query: any) {
    const name = query.name;

    if (name) {
      return this.authorizationService.findName(name);
    } else {
      return this.authorizationService.findAll();
    }
  }
  @Get()
  findAll() {
    return this.authorizationService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorizationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authorizationService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorizationService.remove(+id);
  }
}

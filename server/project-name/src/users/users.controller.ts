import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('add-user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('get-users')
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('option') option?: 'email' | 'phone' | 'name',
    @Query('filter') filter?: string,
  ) {
    return this.usersService.findAll({ page, limit, option, filter });
  }

  @Get('get-user/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post('seed')
  async seed() {
    return this.usersService.seedUsers(2000000);
  }
}

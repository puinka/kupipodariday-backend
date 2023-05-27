import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.usersService.create(createUserDto);
    return newUser;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return this.usersService.updateById(id, updateUserDto);
  }

  @Delete(':id')
  async removeById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return this.usersService.removeById(id);
  }
}

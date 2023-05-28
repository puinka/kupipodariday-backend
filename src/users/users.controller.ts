import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET/users/me
  // PATCH/users/me
  // GET/users/me/wishes

  // GET/users/{username}
  @Get(':username')
  async findUserByUsername(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findUserByUsername(username);
    if (!user) throw new NotFoundException(`User not found`);
    return user;
  }

  // GET/users/{username}/wishes
  @Get(':username/wishes')
  async findWishesByUsername(
    @Param('username') username: string,
  ): Promise<Wish[]> {
    const { id } = await this.usersService.findUserByUsername(username);
    if (!id) throw new NotFoundException(`User not found`);

    const wishes = await this.usersService.findUserWishes(id);
    if (!wishes) throw new NotFoundException(`User has no wishes`);

    return wishes;
  }

  // POST/users/find
  @Post('find')
  async findByEmail(@Body() query: string): Promise<User[]> {
    const user = await this.usersService.findByEmail(query);
    if (!user) throw new NotFoundException(`User not found`);
    return user;
  }

  // @Post('signup')
  // async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
  //   return await this.usersService.create(createUserDto);
  // }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.usersService.findById(id);
  // }
  //@Patch(':id')
  // async updateById(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   const user = await this.usersService.findById(id);
  //   if (!user) {
  //     throw new NotFoundException(`User not found`);
  //   }

  //   return this.usersService.updateById(id, updateUserDto);
  // }

  // @Delete(':id')
  // async removeById(@Param('id', ParseIntPipe) id: number) {
  //   const user = await this.usersService.findById(id);
  //   if (!user) {
  //     throw new NotFoundException(`User not found`);
  //   }

  //   return this.usersService.removeById(id);
  // }
}

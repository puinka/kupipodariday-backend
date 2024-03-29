import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { JwtGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET/users/me
  @Get('me')
  async findMe(@Req() req) {
    const user = await this.usersService.findOne({
      where: { id: req.user.id },
    });
    if (!user) throw new NotFoundException(`User not found`);
    const { password, ...result } = user;
    return result;
  }

  // PATCH/users/me
  @Patch('me')
  async updateMe(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateById(req.user.id, updateUserDto);
  }

  // GET/users/me/wishes
  @Get('me/wishes')
  async findMyWishes(@Req() req): Promise<Wish[]> {
    const wishes = await this.usersService.findUserWishes(req.user.id);
    if (!wishes) throw new NotFoundException(`User has no wishes`);
    return wishes;
  }

  // GET/users/{username}
  @Get(':username')
  async findUserByUsername(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findOne({ where: { username } });
    if (!user) throw new NotFoundException(`User ${username} not found`);
    const { password, ...result } = user;
    return result;
  }

  // GET/users/{username}/wishes
  @Get(':username/wishes')
  async findWishesByUsername(
    @Param('username') username: string,
  ): Promise<Wish[]> {
    const { id } = await this.usersService.findOne({ where: { username } });
    if (!id) throw new NotFoundException(`User not found`);

    const wishes = await this.usersService.findUserWishes(id);
    if (!wishes) throw new NotFoundException(`User has no wishes`);

    return wishes;
  }

  // POST/users/find
  @Post('find')
  async findUser(@Body() search): Promise<User[]> {
    return await this.usersService.findByEmailOrUsername(search.query);
  }
}

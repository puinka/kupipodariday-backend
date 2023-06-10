import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { comparePassword } from 'src/utils/hash';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  signin(user: User) {
    const payload = { sub: user.id };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
    };
  }

  signup(createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findUserByUsername(username);
    const isValid = await comparePassword(pass, user.password);
    if (!isValid || !user)
      throw new UnauthorizedException('Invalid credentials');

    if (isValid) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
}

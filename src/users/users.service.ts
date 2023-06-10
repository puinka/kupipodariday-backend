import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { hashPassword } from 'src/utils/hash';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, username } = createUserDto;
    const user = await this.userRepository.find({
      where: [{ email: email }, { username: username }],
    });
    if (user) throw new NotFoundException(`User already exists`);

    const { password } = createUserDto;
    const passwordHash = await hashPassword(password);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: passwordHash,
    });
    return await this.userRepository.save(newUser);
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User not found`);
    return user;
  }

  // findAll(): Promise<User[]> {
  //   return this.userRepository.find();
  // }

  async findUserByUsername(username: string): Promise<User> {
    return await this.userRepository.findOneBy({ username });
  }

  async findUserWishes(id: number): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      where: { owner: { id } },
    });
    return wishes;
  }

  async findByEmail(query: string): Promise<User[]> {
    const user = await this.userRepository.find({
      where: [{ email: query }],
    });
    return user;
  }

  updateById(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update({ id }, updateUserDto);
  }

  // removeById(id: number) {
  //   return this.userRepository.delete({ id });
  // }
}

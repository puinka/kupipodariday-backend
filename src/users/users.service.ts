import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
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
    const isExist = await this.userRepository.find({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });
    if (isExist) throw new UnauthorizedException(`User already exists`);

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

  async findByEmailOrUsername(query: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ email: query }, { username: query }],
    });
    return user;
  }

  async updateById(id: number, updateUserDto: UpdateUserDto) {
    const { email, username, password } = updateUserDto;
    const user = await this.findUserById(id);

    if (email) {
      const emailOwner = await this.findByEmailOrUsername(email);
      if (emailOwner && emailOwner.id !== id) {
        throw new ConflictException(`This email is already in use`);
      }
    }

    if (username) {
      const usernameOwner = await this.findByEmailOrUsername(username);
      if (usernameOwner && usernameOwner.id !== id) {
        throw new ConflictException(`This username is already in use`);
      }
    }

    if (password) {
      const passwordHash = await hashPassword(password);
      updateUserDto.password = passwordHash;
    }

    const updatedData = { ...user, ...updateUserDto };

    await this.userRepository.update({ id }, updatedData);
    return this.findUserById(id);
  }

  async findUserWishes(id: number): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      where: { owner: { id } },
    });
    return wishes;
  }

  // removeById(id: number) {
  //   return this.userRepository.delete({ id });
  // }
}

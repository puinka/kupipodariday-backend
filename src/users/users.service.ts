import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { hashPassword } from 'src/utils/hash';
import { log } from 'console';

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
    const isExist = await this.userRepository.findOne({
      where: [{ email }, { username }],
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

  async findOne(query: FindOneOptions<User>): Promise<User> {
    return await this.userRepository.findOne(query);
  }

  async findByEmailOrUsername(query: string): Promise<User[]> {
    const users = await this.userRepository.find({
      where: [{ email: query }, { username: query }],
    });
    return users;
  }

  async updateById(id: number, updateUserDto: UpdateUserDto) {
    const { email, username, password } = updateUserDto;
    const user = await this.findOne({ where: { id } });

    if (email) {
      const emailOwner = await this.findOne({ where: { email } });
      if (emailOwner && emailOwner.id !== id) {
        throw new ConflictException(`This email is already in use`);
      }
    }

    if (username) {
      const usernameOwner = await this.findOne({ where: { username } });
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
    return this.findOne({ where: { id } });
  }

  async findUserWishes(id: number): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      where: { owner: { id } },
    });
    return wishes;
  }
}

import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async findLastWishes(): Promise<Wish[]> {
    return await this.wishRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
    });
  }

  async findTopWishes(): Promise<Wish[]> {
    return await this.wishRepository.find({
      take: 10,
      order: { copied: 'DESC' },
    });
  }
  // create(createWishDto: CreateWishDto) {
  //   return 'This action adds a new wish';
  // }
  // findAll() {
  //   return `This action returns all wishes`;
  // }
  // findOne(id: number) {
  //   return `This action returns a #${id} wish`;
  // }
  // update(id: number, updateWishDto: UpdateWishDto) {
  //   return `This action updates a #${id} wish`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} wish`;
  // }
}

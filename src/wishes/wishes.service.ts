import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findOne(query): Promise<Wish> {
    return await this.wishRepository.findOne(query);
  }

  async findById(id: number) {
    return await this.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.user'],
    });
  }

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

  createWish(createWishDto: CreateWishDto, owner) {
    const newWish = this.wishRepository.create({
      ...createWishDto,
      owner,
    });
    return this.wishRepository.save(newWish);
  }

  async updateWish(id: number, updateWishDto: UpdateWishDto, ownerId: number) {
    const wish = await this.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!wish) throw new NotFoundException(`Wish with #${id} not found`);

    if (wish.owner.id !== ownerId) {
      throw new ForbiddenException(`You can't edit this wish`);
    }

    if (updateWishDto.price && wish.raised > 0) {
      throw new ForbiddenException(
        `You can't edit price of this wish as it already has offers`,
      );
    }
    return this.wishRepository.update(id, updateWishDto);
  }

  async removeWish(id: number, ownerId: number) {
    const wish = await this.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!wish) throw new NotFoundException(`Wish with #${id} not found`);
    if (wish.owner.id !== ownerId) {
      throw new ForbiddenException(`You can't delete this wish`);
    }
    return this.wishRepository.delete(id);
  }

  async copyWish(id: number, ownerId: number) {
    const wish = await this.findOne({
      where: { id },
      relations: { owner: false },
    });
    if (!wish)
      throw new NotFoundException(
        `Wish with #${id} not found or it's already yours`,
      );
    await this.createWish({ ...wish, raised: 0, copied: 0 }, ownerId);
  }
}

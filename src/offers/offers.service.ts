import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async findOne(id: number): Promise<Offer> {
    return await this.offerRepository.findOne({
      where: { id },
    });
  }

  async createOffer(createOfferDto: CreateOfferDto, user: User) {
    const { itemId, amount } = createOfferDto;
    const wish = await this.wishesService.findOne({
      where: { id: itemId },
      relations: { owner: true },
    });

    if (!wish) throw new NotFoundException(`Wish with #${itemId} not found`);

    if (wish.owner.id === user.id)
      throw new ForbiddenException(`You can't offer for your own wish`);

    const { price, raised } = wish;

    if (amount + raised > price) {
      throw new ForbiddenException(
        `You can't offer more than ${price - raised} RUB at the moment`,
      );
    }

    await this.wishesService.updateWish(
      itemId,
      { raised: amount + raised },
      wish.owner.id,
    );

    const offer = this.offerRepository.create({
      ...createOfferDto,
      user: user,
      item: wish,
    });

    return this.offerRepository.save(offer);
  }

  async findAll() {
    return await this.offerRepository.find({
      where: {},
      relations: { user: true, item: true },
    });
  }
}

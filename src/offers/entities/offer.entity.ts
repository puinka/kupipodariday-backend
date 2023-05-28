import { IsNumber } from 'class-validator';
import { BaseEntity } from 'src/base-entity/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
export class Offer extends BaseEntity {
  @ManyToOne(() => User, (user) => user.offers)
  owner: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  amount: number;

  @Column({ default: false })
  hidden: boolean;
}

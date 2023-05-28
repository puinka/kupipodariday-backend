import {
  IsDecimal,
  IsEmail,
  IsNumber,
  IsPositive,
  IsUrl,
  Length,
} from 'class-validator';
import { BaseEntity } from 'src/base-entity/base.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  @Length(2, 250)
  name: string;

  @Column()
  @IsEmail()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  @Length(1, 1024)
  description: string;

  @Column()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  price: number;

  @Column({
    default: 0,
  })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  raised: number;

  @Column({ default: 0 })
  @IsDecimal()
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToOne(() => Wishlist, (wishList) => wishList.wishes)
  wishlist: Wishlist;
}

import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { Length } from 'class-validator';
import { BaseEntity } from 'src/base-entity/base.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @Length(1, 1500)
  description: string;

  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @OneToMany(() => Wish, (wish) => wish.wishlist)
  wishes: Wish[];
}

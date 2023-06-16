import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  // GET /wishlists
  @Get()
  async findAll() {
    return this.wishlistsService.findAllLists();
  }

  // POST /wishlists
  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto, @Req() req) {
    return this.wishlistsService.createList(createWishlistDto, req.user.id);
  }

  // GET /wishlists/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findList(+id);
  }

  // PATCH /wishlists/:id
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.updateList(+id, updateWishlistDto);
  }

  // DELETE /wishlists/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishlistsService.removeList(+id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  // POST/wishes
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() req) {
    return this.wishesService.createWish(createWishDto, req.user.id);
  }

  // GET/wishes/last
  @Get('last')
  async findLastWishes() {
    return await this.wishesService.findLastWishes();
  }

  // GET/wishes/top
  @Get('top')
  async findTopWishes() {
    return await this.wishesService.findTopWishes();
  }

  // GET/wishes/{id}
  @UseGuards(JwtGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    const wish = await this.wishesService.findById(+id);
    if (!wish) throw new NotFoundException(`Wish with #${id} not found`);
    return wish;
  }

  // PATCH/wishes/{id}
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req,
  ) {
    return this.wishesService.updateWish(+id, updateWishDto, req.user.id);
  }

  // DELETE/wishes/{id}
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.wishesService.removeWish(+id, req.user.id);
  }

  // POST/wishes/{id}/copy
  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(@Param('id') id: string, @Req() req) {
    return await this.wishesService.copyWish(+id, req.user.id);
  }
}

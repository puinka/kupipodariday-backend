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
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  // GET/offers
  @Get()
  async findAll() {
    return await this.offersService.findAll();
  }

  // POST/offers
  @Post()
  async create(@Body() createOfferDto: CreateOfferDto, @Req() req) {
    return await this.offersService.createOffer(createOfferDto, req.user);
  }

  // GET/offers/{id}
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.offersService.findOne(+id);
  }
}

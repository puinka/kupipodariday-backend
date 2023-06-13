import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
<<<<<<< HEAD
    private configService: ConfigService,
=======
    //private configService: ConfigService,
>>>>>>> dev
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
<<<<<<< HEAD
      secretOrKey: configService.get<string>('JWT_SECRET') || 'supersecret',
=======
      //secretOrKey: configService.get<string>('JWT_SECRET') || 'supersecret',
      secretOrKey: 'supersecret',
>>>>>>> dev
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException(`Wrong credentials provided`);
    }
    return user;
  }
}

import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { HashingHelper } from 'src/helper/hashing.helper';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: CreateAuthDto) {
    try {
      //fetch the user
      const user = await this.userService.findByEmail(dto.email);

      //check for his existence
      if (!user) {
        throw new NotFoundException("this user doasn't exist");
      }
      //password check
      const pwMatches = await HashingHelper.comparePassword(
        dto.password,
        user.password,
      );
      if (!pwMatches) {
        throw new NotFoundException('wrong credentials');
      }
      //generate tokens
      const tokens = await this.getTokens(user.email, user.name);
      //update refresh token
      await this.updateRefreshToken(user.email, tokens.refreshToken);
      //return the tokens
      return tokens;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
  async signout(email: string) {
    try {
      await this.userService.update(email, { refreshToken: null });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async getTokens(email: string, name: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: email, name },
        { expiresIn: '15m', secret: process.env.JWT_SECRET },
      ),
      this.jwtService.signAsync(
        { sub: email, name },
        { secret: process.env.JWT_SECRET, expiresIn: '15m' },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
  async updateRefreshToken(email: string, refreshToken: string) {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new NotFoundException("this user doasn't exist");
      }
      const hashedRefreshToken = await HashingHelper.hashPassword(refreshToken);
      await this.userService.update(email, {
        refreshToken: hashedRefreshToken,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
  async refreshToken(email: string,refreshToken:string) {
    const user =await  this.userService.findByEmail(email);
    if (!user||!user.refreshToken) {
      throw new ForbiddenException("Access Denied");
    }
    const refreshTokenMatches = await HashingHelper.comparePassword(refreshToken, user.refreshToken);
    if (!refreshTokenMatches) {
      throw new ForbiddenException("Access Denied");
    }
    const tokens = await this.getTokens(email,user.name);
    this.updateRefreshToken(email, tokens.refreshToken);
    return tokens;
  }
}

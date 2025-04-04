import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingHelper } from 'src/helper/hashing.helper';
import { updateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateUserDto) {
    try {
      const user = await this.findByEmail(dto.email);
      dto.password = await HashingHelper.hashPassword(dto.password);
      if (user) {
        throw new ConflictException('this user already exists');
      }
      return await this.prismaService.user.create({
        data: dto,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
  async findByEmail(email: string) {
    try {
      return this.prismaService.user.findUnique({
        where: {
          email,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async update(email: string, dto: updateUserDto) {
    try {
      const user = await this.findByEmail(email);
      if (!user) {
        throw new NotFoundException("this user doasn't exist");
      }
      await this.prismaService.user.update({
        data: dto,
        where: {
          email,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}

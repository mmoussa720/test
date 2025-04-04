import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private user: UserService) {}
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.user.create(dto);
  }
  @Get(':email')
  findByEmail(@Param('email') email: string) {
      return this.user.findByEmail(email);
  }
}

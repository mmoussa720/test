import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { Request } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }
  @Get('signout/:email')
  signout(@Param('email') email: string) {
    return this.authService.signout(email);
  }
  @Get('refresh')
  refresh(@Req() req: Request) {
    const userEmail = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshToken(userEmail, refreshToken);
  }
}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {JwtModule} from '@nestjs/jwt'
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions:{expiresIn:"60s"}
    })
  ],
  providers: [AuthService],
})
export class AuthModule {}

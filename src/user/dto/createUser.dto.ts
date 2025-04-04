import {
  IsAlpha,
  IsEmail,
  isEmail,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsAlpha()
  name: string;
  @IsEmail()
  email: string;
  @IsStrongPassword()
  password: string;
  @IsOptional()
  refreshToken: string;
}

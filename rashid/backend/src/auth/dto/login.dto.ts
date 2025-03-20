import { IsString, IsEmail, IsOptional, Matches } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be in international format',
  })
  phone?: string;

  @IsString()
  password: string;
} 
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';
import { AuthGateway } from './auth.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthService, AuthGateway],
  exports: [AuthService],
})
export class AuthModule {} 
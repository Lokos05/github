import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: true,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const { email, phone } = registerDto;

    // Проверяем, существует ли пользователь с таким email или телефоном
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { phone }],
    });

    if (existingUser) {
      throw new BadRequestException('User with this email or phone already exists');
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Генерируем код подтверждения
    const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const verificationCodeExpires = new Date();
    verificationCodeExpires.setMinutes(verificationCodeExpires.getMinutes() + 10);

    // Создаем нового пользователя
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpires,
    });

    await this.userRepository.save(user);

    // Отправляем код подтверждения на email
    await this.sendVerificationEmail(user.email, verificationCode);

    return user;
  }

  async login(loginDto: LoginDto): Promise<User> {
    const { email, phone, password } = loginDto;

    // Ищем пользователя по email или телефону
    const user = await this.userRepository.findOne({
      where: [{ email }, { phone }],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    return user;
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<User> {
    const { email, code } = verifyEmailDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    if (user.verificationCode !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    if (new Date() > user.verificationCodeExpires) {
      throw new BadRequestException('Verification code has expired');
    }

    user.isEmailVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;

    return this.userRepository.save(user);
  }

  private async sendVerificationEmail(email: string, code: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_FROM'),
      to: email,
      subject: 'Email Verification',
      html: `
        <h1>Email Verification</h1>
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `,
    });
  }
} 
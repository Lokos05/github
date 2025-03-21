import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
    private readonly prisma: PrismaService,
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

  async register(registerDto: RegisterDto) {
    const { email, phone } = registerDto;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone },
        ],
      },
    });

    if (existingUser) {
      throw new BadRequestException('Пользователь с таким email или телефоном уже существует');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const verificationCodeExpires = new Date();
    verificationCodeExpires.setMinutes(verificationCodeExpires.getMinutes() + 10);

    const user = await this.prisma.user.create({
      data: {
        ...registerDto,
        password: hashedPassword,
        verificationCode,
        verificationCodeExpires,
      },
    });

    await this.sendVerificationEmail(user.email, verificationCode);

    return user;
  }

  async login(loginDto: LoginDto) {
    const { email, phone, password } = loginDto;

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone },
        ],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Пожалуйста, подтвердите свой email');
    }

    return user;
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { email, code } = verifyEmailDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email уже подтвержден');
    }

    if (user.verificationCode !== code) {
      throw new BadRequestException('Неверный код подтверждения');
    }

    if (user.verificationCodeExpires && new Date() > user.verificationCodeExpires) {
      throw new BadRequestException('Срок действия кода подтверждения истек');
    }

    return this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationCode: null,
        verificationCodeExpires: null,
      },
    });
  }

  private async sendVerificationEmail(email: string, code: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_FROM'),
      to: email,
      subject: 'Подтверждение email',
      html: `
        <h1>Подтверждение email</h1>
        <p>Ваш код подтверждения: <strong>${code}</strong></p>
        <p>Код действителен в течение 10 минут.</p>
      `,
    });
  }
} 
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@WebSocketGateway()
export class AuthGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly authService: AuthService) {}

  @SubscribeMessage('register')
  async handleRegister(@MessageBody() registerDto: RegisterDto) {
    try {
      const user = await this.authService.register(registerDto);
      return {
        event: 'register',
        data: {
          success: true,
          message: 'Registration successful. Please check your email for verification code.',
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            isEmailVerified: user.isEmailVerified,
          },
        },
      };
    } catch (error) {
      return {
        event: 'register',
        data: {
          success: false,
          message: error.message,
        },
      };
    }
  }

  @SubscribeMessage('login')
  async handleLogin(@MessageBody() loginDto: LoginDto) {
    try {
      const user = await this.authService.login(loginDto);
      return {
        event: 'login',
        data: {
          success: true,
          message: 'Login successful',
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            isEmailVerified: user.isEmailVerified,
          },
        },
      };
    } catch (error) {
      return {
        event: 'login',
        data: {
          success: false,
          message: error.message,
        },
      };
    }
  }

  @SubscribeMessage('verifyEmail')
  async handleVerifyEmail(@MessageBody() verifyEmailDto: VerifyEmailDto) {
    try {
      const user = await this.authService.verifyEmail(verifyEmailDto);
      return {
        event: 'verifyEmail',
        data: {
          success: true,
          message: 'Email verification successful',
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            isEmailVerified: user.isEmailVerified,
          },
        },
      };
    } catch (error) {
      return {
        event: 'verifyEmail',
        data: {
          success: false,
          message: error.message,
        },
      };
    }
  }
} 
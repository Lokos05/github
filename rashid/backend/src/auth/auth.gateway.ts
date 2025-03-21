import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { WebSocket } from 'ws';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    isEmailVerified: boolean;
  };
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transport: WebSocket,
})
export class AuthGateway {
  @WebSocketServer()
  private server: WebSocket.Server;

  constructor(private readonly authService: AuthService) {}

  @SubscribeMessage('register')
  async handleRegister(
    @MessageBody() registerDto: RegisterDto
  ): Promise<WsResponse<AuthResponse>> {
    try {
      const user = await this.authService.register(registerDto);
      return {
        event: 'register',
        data: {
          success: true,
          message: 'Регистрация успешна. Проверьте email для подтверждения.',
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
          message: error instanceof Error ? error.message : 'Произошла ошибка при регистрации',
        },
      };
    }
  }

  @SubscribeMessage('login')
  async handleLogin(
    @MessageBody() loginDto: LoginDto
  ): Promise<WsResponse<AuthResponse>> {
    try {
      const user = await this.authService.login(loginDto);
      return {
        event: 'login',
        data: {
          success: true,
          message: 'Вход выполнен успешно',
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
          message: error instanceof Error ? error.message : 'Произошла ошибка при входе',
        },
      };
    }
  }

  @SubscribeMessage('verifyEmail')
  async handleVerifyEmail(
    @MessageBody() verifyEmailDto: VerifyEmailDto
  ): Promise<WsResponse<AuthResponse>> {
    try {
      const user = await this.authService.verifyEmail(verifyEmailDto);
      return {
        event: 'verifyEmail',
        data: {
          success: true,
          message: 'Email успешно подтвержден',
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
          message: error instanceof Error ? error.message : 'Произошла ошибка при подтверждении email',
        },
      };
    }
  }
} 
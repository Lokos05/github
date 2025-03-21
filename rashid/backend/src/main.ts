import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useWebSocketAdapter(new WsAdapter(app));
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Приложение запущено на: http://localhost:${port}`);
}

bootstrap(); 
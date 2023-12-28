import { NestFactory } from '@nestjs/core';
import { swaggerSetup } from './common/utils/swagger-setup';
import { AppModule } from './modules/app/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  const host = configService.get('HOST');
  swaggerSetup(app);
  await app.listen(port, host);
}
bootstrap();

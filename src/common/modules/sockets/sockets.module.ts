import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_CONFIG_KEY, AppConfigType } from '../../config/app.config';
import { SocketsGateway } from './sockets.gateway';
import { SocketsService } from './sockets.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (appConfig: AppConfigType) => ({
        secret: appConfig.jwtSecret,
        signOptions: { expiresIn: appConfig.jwtAccessExpiresIn },
      }),
      inject: [APP_CONFIG_KEY],
    }),
  ],
  providers: [SocketsGateway, SocketsService],
  exports: [SocketsService],
})
export class SocketsModule {}

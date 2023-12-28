import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AuthStatusMessages } from './dto/auth.constants';
import bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { MAILER_CONFIG_KEY, MailerConfigType } from 'src/common/config/mailer.config';
import { MailerService } from 'src/common/modules/mailer/mailer.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { AuthFormDto } from './dto/users.dto';
import { Users } from './entities/user.entity';
import { RecoveryPasswordCode } from './entities/recovery.entity';
import { LoginFormDto } from './dto/login.dto';
import { Token } from './dto/token.dto';
import { SecurityConfig } from './dto/config';
import { RefreshTokenDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private readonly authRepository: Repository<Users>,
    @InjectRepository(RecoveryPasswordCode)
    private readonly recoveryPasswordRepository: Repository<RecoveryPasswordCode>,
    private jwtService: JwtService,
    @Inject(MAILER_CONFIG_KEY)
    private readonly mailConfig: MailerConfigType,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}
  async registration(authDto: AuthFormDto) {
    if (
      !authDto.email ||
      !authDto.password ||
      !authDto.name ||
      !authDto.surname ||
      !authDto.phone
    ) {
      throw new HttpException(AuthStatusMessages.INCOMPLETE_FIELD_ERROR, HttpStatus.BAD_REQUEST);
    }

    const user = await this.authRepository.findOne({
      where: { email: authDto.email },
    });
    if (user) {
      throw new HttpException(AuthStatusMessages.ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(authDto.password, 10);
    await this.authRepository.save({ ...authDto, password: hashedPassword });

    // await this.mailerService.sendMail({
    //   subject: 'New registration form',
    //   emails: [this.mailConfig.managerEmail],
    //   htmlTemplate: 'new-reg',
    //   templateVars: {
    //     name: authDto.name,
    //     surname: authDto.surname,
    //     email: authDto.email,
    //     phone: authDto.phone,
    //     password: authDto.password,
    //   },
    // });

    return {
      statusCode: HttpStatus.CREATED,
      message: AuthStatusMessages.REGISTERED_SUCCESSFULLY,
    };
  }

  async login(loginDto: LoginFormDto) {
    const user = await this.authRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new HttpException(AuthStatusMessages.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new HttpException(AuthStatusMessages.INVALID, HttpStatus.BAD_REQUEST);
    }

    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
  async recoveryPassword(data: string) {
    if (!data) {
      throw new HttpException(AuthStatusMessages.INCOMPLETE_FIELD_ERROR, HttpStatus.BAD_REQUEST);
    }

    const user = await this.authRepository.findOne({
      where: { email: data },
    });
    if (!user) {
      throw new HttpException(AuthStatusMessages.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    const existCode = (
      await this.recoveryPasswordRepository.find({
        where: {
          userId: user.id,
        },
      })
    ).filter((item) => item.deletedAt === null)[0];
    if (existCode) {
      await this.recoveryPasswordRepository.update(existCode.id, {
        deletedAt: new Date(),
      });
    }

    const recoveryCode = this.generateRecoveryCode();
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 30); // Добавляем 30 минут к текущему времени

    await this.recoveryPasswordRepository.save({
      userId: user.id,
      code: recoveryCode,
      deletedAt: null,
      expiresAt: expirationTime, // Устанавливаем время истечения
    });

    // await this.mailerService.sendMail({
    //   subject: 'Password recovery',
    //   emails: [data],
    //   htmlTemplate: 'password-recovery',
    //   templateVars: {
    //     code: recoveryCode,
    //   },
    // });

    return {
      statusCode: HttpStatus.CREATED,
      message: AuthStatusMessages.CREATED,
    };
  }

  async setPassword({ code, email, newPassword }) {
    if (!email || !code || !newPassword) {
      throw new HttpException(AuthStatusMessages.INCOMPLETE_FIELD_ERROR, HttpStatus.BAD_REQUEST);
    }

    const user = await this.authRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new HttpException(AuthStatusMessages.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    const existCode = (
      await this.recoveryPasswordRepository.find({
        where: { userId: user.id },
      })
    ).filter((item) => item.deletedAt === null)[0];
    if (!existCode) {
      throw new HttpException(AuthStatusMessages.CODE_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    if (existCode.code !== code) {
      throw new HttpException(AuthStatusMessages.INCORRECT_CODE, HttpStatus.BAD_REQUEST);
    }
    if (existCode.expiresAt < new Date()) {
      throw new HttpException(AuthStatusMessages.EXPIRED_CODE, HttpStatus.BAD_REQUEST);
    }

    const comparedPassword = await bcrypt.compare(newPassword, user.password);
    if (comparedPassword) {
      throw new HttpException(AuthStatusMessages.ERROR_SET_PASSWORD, HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.authRepository.update(user.id, { password: hashedPassword });

    await this.recoveryPasswordRepository.update(existCode.id, {
      deletedAt: new Date(),
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: AuthStatusMessages.PASSWORD_UPDATED_SUCCESSFULLY,
    };
  }

  generateRecoveryCode() {
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10).toString();
    }
    return code;
  }

  async refreshToken(tokenDto: RefreshTokenDto): Promise<Token> {
    const { userId } = this.jwtService.verify(tokenDto.refreshToken, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
    const tokens = await this.generateTokens({ userId });

    return tokens;
  }

  generateTokens(payload: { userId: string }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload);
  }
  private generateRefreshToken(payload: { userId: string }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: securityConfig!.refreshIn,
    });
  }
}

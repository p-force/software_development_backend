import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthStatusMessages } from './dto/auth.constants';
import { AuthFormDto } from './dto/users.dto';
import { LoginFormDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh.dto';
import { makeError } from 'src/common/utils/make-error';

@ApiTags('Auth Form')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({ summary: 'Registration' })
  //#region
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    description: AuthStatusMessages.REGISTERED_SUCCESSFULLY,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `${AuthStatusMessages.ALREADY_EXISTS}\t\n\t\nAn Account with this Email Already Exists`,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `${AuthStatusMessages.INCOMPLETE_FIELD_ERROR}\t\n\t\nincomplete field error`,
  })
  @Post('registration')
  async registration(@Body() userData: AuthFormDto) {
    return this.authService.registration(userData);
  }
  //#endregion

  @ApiOperation({ summary: 'Login' })
  //#region
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: AuthStatusMessages.AUTHORIZED_SUCCESSFULLY,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `${AuthStatusMessages.NOT_FOUND}\t\n\t\nNo Account Found with this Email`,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `${AuthStatusMessages.INVALID}\t\n\t\nIncorrect login or password`,
  })
  @Post('/login')
  async login(@Body() loginDto: LoginFormDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }
  //#endregion

  @ApiOperation({ summary: 'Forgot password/ Send recovery code' })
  //#region
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    description: AuthStatusMessages.CREATED,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `${AuthStatusMessages.INCOMPLETE_FIELD_ERROR}\t\n\t\nincomplete field error`,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `${AuthStatusMessages.NOT_FOUND}\t\n\t\nNo account with this email`,
  })
  @Post('/recovery-password')
  async recoveryPassword(@Body() { email }) {
    return this.authService.recoveryPassword(email);
  }
  //#endregion

  @ApiOperation({ summary: 'Set new password' })
  //#region
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    description: AuthStatusMessages.PASSWORD_UPDATED_SUCCESSFULLY,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The request failed. Possible reasons:',
    content: {
      'application/json': {
        examples: {
          userNotFound: {
            summary: 'No account with this email',
            value: { status: HttpStatus.BAD_REQUEST, error: AuthStatusMessages.NOT_FOUND },
          },
          errorSetPassword: {
            summary: 'Code not exists',
            value: { status: HttpStatus.BAD_REQUEST, error: AuthStatusMessages.CODE_NOT_FOUND },
          },
          expiredCode: {
            summary: 'The recovery code is saved',
            value: { status: HttpStatus.BAD_REQUEST, error: AuthStatusMessages.EXPIRED_CODE },
          },
          incorrectCode: {
            summary: 'Incorrect code',
            value: { status: HttpStatus.BAD_REQUEST, error: AuthStatusMessages.INCORRECT_CODE },
          },
          comparedPassword: {
            summary: 'New password is the same as old password',
            value: { status: HttpStatus.BAD_REQUEST, error: AuthStatusMessages.ERROR_SET_PASSWORD },
          },
        },
      },
    },
  })
  @Post('/set-password')
  async setPassword(@Body() data: { code: string; email: string; newPassword: string }) {
    return this.authService.setPassword(data);
  }
  //#endregion

  @ApiOperation({ summary: 'Refresh Token' })
  //#region
  @ApiOkResponse({ description: 'Access token and refresh token successfully refreshed.' })
  @ApiBadRequestResponse({ description: 'Invalid or expired refresh token.' })
  @Post('/refresh-token')
  async refreshToken(@Body() tokenDto: RefreshTokenDto) {
    try {
      const newToken = await this.authService.refreshToken(tokenDto);

      return {
        access_token: newToken.accessToken,
        refresh_token: newToken.refreshToken,
      };
    } catch (error) {
      throw makeError(401, { message: 'Invalid token' });
    }
  }
  //#endregion
}

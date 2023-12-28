import { Body, Controller, Get, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { MyAccountService } from './my-account.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ApiBadRequestResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { AccountStatusMessages } from './my-account.constants';
import { ChangeAttributesDto } from './attributes.dto';

@ApiTags('My Account')
@Controller('my-account')
export class MyAccountController {
  constructor(private readonly accountService: MyAccountService) {}
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Orders History' })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `${AccountStatusMessages.ERROR}`,
  })
  @Get('/orders')
  getOrders(@CurrentUser() { email }) {
    return this.accountService.getOrders(email);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Personal Details' })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `${AccountStatusMessages.ERROR}`,
  })
  @Get('get-personal-details')
  async getPersonalDetails(@CurrentUser() { email }) {
    return this.accountService.getPersonalDetails(email);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Change Personal Details' })
  @ApiBadRequestResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: `${AccountStatusMessages.ERROR}\n\nSomething went wrong`,
  })
  @Put('change-personal-details')
  async changePersonalDetails(@CurrentUser() user, @Body() attributes: ChangeAttributesDto) {
    return this.accountService.changePersonalDetails(user, attributes);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get Orders History' })
  @ApiBadRequestResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: `${AccountStatusMessages.ERROR}\n\nSomething went wrong`,
  })
  @Get('get-history')
  async getHistory(@CurrentUser() { email }) {
    return this.accountService.getOrdersHistory(email);
  }
}

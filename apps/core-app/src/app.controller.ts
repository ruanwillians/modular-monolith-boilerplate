import { Body, Controller, Get, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService, Public, Role, Roles, UserFromJwt } from '@auth/auth';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Roles(Role.Admin, Role.User)
  @Get('shared')
  getSharedResource(@Request() req: { user: UserFromJwt }) {
    return {
      message: `This is a shared resource for Admins and Users. Welcome, ${req.user.email}!`,
    };
  }
}

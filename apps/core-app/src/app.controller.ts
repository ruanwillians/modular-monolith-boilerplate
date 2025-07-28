import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService, Public, Role, Roles, UserFromJwt } from '@auth/auth';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('public')
  getPublicResource() {
    return { message: 'This is a public resource.' };
  }

  @Get('profile')
  getProfile(@Request() req: { user: UserFromJwt }) {
    return {
      message: 'This is a protected resource for any authenticated user.',
      user: req.user,
    };
  }

  @Roles(Role.Admin)
  @Get('admin')
  getAdminResource(@Request() req: { user: UserFromJwt }) {
    return {
      message: `This is a protected resource for admins only. Welcome, ${req.user.email}!`,
    };
  }

  @Roles(Role.Admin, Role.User)
  @Get('shared')
  getSharedResource(@Request() req: { user: UserFromJwt }) {
    return {
      message: `This is a shared resource for Admins and Users. Welcome, ${req.user.email}!`,
    };
  }

  @Public()
  @Post('login')
  login(@Body() body: { role: Role }) {
    const user =
      body.role === Role.Admin
        ? { userId: 1, email: 'admin@example.com', role: Role.Admin }
        : { userId: 2, email: 'user@example.com', role: Role.User };
    return this.authService.login(user);
  }
}

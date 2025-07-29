import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRequestDto } from './dto/request/create-user-request.dto';
import { Public, Role, Roles } from '@auth/auth';
import { LoginUserRequestDto } from './dto/request/login-user-request.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserRequestDto) {
    return this.usersService.create(createUserDto);
  }

  @Public()
  @Post('login')
  login(@Body() loginUserDto: LoginUserRequestDto) {
    return this.usersService.login(loginUserDto);
  }

  @Roles(Role.User, Role.Admin)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}

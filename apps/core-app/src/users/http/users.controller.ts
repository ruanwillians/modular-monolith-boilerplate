import { Controller, Post, Body, Param, Get, Request } from '@nestjs/common';
import { Public, Role, Roles } from '@auth/auth';
import { LoginUserRequestDto } from './dto/request/login-user-request.dto';
import { LoginUserUseCase } from '../domain/usecases/login-user.usecase';
import { CreateUserUseCase } from '../domain/usecases/create-user.usecase';
import { CreateUserRequestDto } from './dto/request/create-user-request.dto';
import { LoginUserResponseDto } from './dto/response/login-user-response.dto';
import { CreateUserResponseDto } from './dto/response/create-user-response.dto';
import { FindUserResponseDto } from './dto/response/find-user-response.dto';
import { FindUserUseCase } from '../domain/usecases/find-user.usecase';
import { RefreshTokenUserRequestDto } from './dto/request/refresh-token-user-request.dto';
import { RefreshTokenUSerUseCase } from '../domain/usecases/refresh-token-user.usecase';

@Controller('users')
export class UsersController {
  constructor(
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserUseCase: FindUserUseCase,
    private readonly refreshTokenUserUseCase: RefreshTokenUSerUseCase,
  ) {}

  @Public()
  @Post('login')
  login(
    @Body() loginUserDto: LoginUserRequestDto,
  ): Promise<LoginUserResponseDto> {
    return this.loginUserUseCase.execute(loginUserDto);
  }

  @Post('refresh-token')
  @Public()
  getSharedResource(@Body() refreshTokenDto: RefreshTokenUserRequestDto) {
    return this.refreshTokenUserUseCase.execute(refreshTokenDto);
  }

  @Public()
  @Post()
  register(
    @Body() createUserDto: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Get(':id')
  @Roles(Role.Admin, Role.User)
  findOne(@Param('id') id: string): Promise<FindUserResponseDto> {
    return this.findUserUseCase.execute(id);
  }
}

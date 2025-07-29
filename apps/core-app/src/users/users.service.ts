import { Injectable } from '@nestjs/common';
import { CreateUserRequestDto } from './dto/request/create-user-request.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserResponseDto } from './dto/response/create-user-response.dto';
import { LoginUserRequestDto } from './dto/request/login-user-request.dto';
import { AuthService, Role } from '@auth/auth';
import { LoginUserResponseDto } from './dto/response/login-user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}

  async create(
    createUserDto: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    createUserDto.password = hashedPassword;

    const userCreated = await this.usersRepository.create(createUserDto);

    return {
      id: userCreated.id,
      email: userCreated.email,
    };
  }

  async login(loginUser: LoginUserRequestDto): Promise<LoginUserResponseDto> {
    const user = await this.usersRepository.findByEmail(loginUser.email);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUser.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error('Senha inválida');
    }

    return this.authService.login({
      userId: user.id.toString(),
      email: user.email,
      role: Role.User,
    });
  }

  async findOne(id: string) {
    return this.usersRepository.findById(id);
  }
}

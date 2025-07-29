import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserRequestDto {
  @IsEmail({}, { message: 'O e-mail informado não é válido.' })
  @IsNotEmpty({ message: 'O campo e-mail não pode estar vazio.' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  @IsNotEmpty({ message: 'O campo senha não pode estar vazio.' })
  password: string;
}

import { IsJWT, IsOptional } from 'class-validator';

export class RefreshTokenUserRequestDto {
  @IsJWT({
    message: 'O token de acesso não é válido.',
  })
  refreshToken: string;

  @IsOptional()
  userId: string;
}

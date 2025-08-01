import { PartialType } from '@nestjs/mapped-types';
import { CreateUserRequestDto } from './create-user-request.dto';

export class UpdateUseRequestDto extends PartialType(CreateUserRequestDto) {}

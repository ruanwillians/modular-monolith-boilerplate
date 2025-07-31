import { DomainException } from 'exceptions/exceptions';

export class UserEntity {
  id: string;
  email: string;
  passwordHash: string;

  constructor(id: string, email: string, passwordHash: string) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
  }

  changeEmail(newEmail: string): void {
    if (newEmail === this.email) {
      throw new DomainException(
        'O novo e-mail não pode ser o mesmo que o atual.',
      );
    }
    this.email = newEmail;
  }

  changePassword(newPasswordHash: string): void {
    if (newPasswordHash === this.passwordHash) {
      throw new DomainException(
        'A nova senha não pode ser a mesma que a atual.',
      );
    }
    this.passwordHash = newPasswordHash;
  }
}

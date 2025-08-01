import { UserEntity } from './user.entity';
import { DomainException } from 'exceptions/exceptions';

describe('UserEntity', () => {
  const id = 'user-123';
  const email = 'test@example.com';
  const passwordHash = 'hashed-password';
  let user: UserEntity;

  beforeEach(() => {
    user = new UserEntity(id, email, passwordHash);
  });

  it('should create a user entity instance correctly', () => {
    expect(user).toBeInstanceOf(UserEntity);
    expect(user.id).toBe(id);
    expect(user.email).toBe(email);
    expect(user.passwordHash).toBe(passwordHash);
  });

  describe('changeEmail', () => {
    it('should throw a DomainException if the new email is the same as the current one', () => {
      const sameEmail = 'test@example.com';

      expect(() => user.changeEmail(sameEmail)).toThrow(
        new DomainException('O novo e-mail não pode ser o mesmo que o atual.'),
      );
      expect(user.email).toBe(email); // Ensure email remains unchanged
    });

    it('should update the email if the new email is different', () => {
      const newEmail = 'new-test@example.com';

      expect(() => user.changeEmail(newEmail)).not.toThrow();
      expect(user.email).toBe(newEmail);
    });
  });

  describe('changePassword', () => {
    it('should throw a DomainException if the new password hash is the same as the current one', () => {
      const samePasswordHash = 'hashed-password';

      expect(() => user.changePassword(samePasswordHash)).toThrow(
        new DomainException('A nova senha não pode ser a mesma que a atual.'),
      );
      expect(user.passwordHash).toBe(passwordHash); // Ensure password remains unchanged
    });

    it('should update the password hash if it is different', () => {
      const newPasswordHash = 'new-hashed-password';

      expect(() => user.changePassword(newPasswordHash)).not.toThrow();
      expect(user.passwordHash).toBe(newPasswordHash);
    });
  });
});

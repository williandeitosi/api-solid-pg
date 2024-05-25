import { InMemoryUserRepository } from '@/repositories/in-memory-repository/in-memory-users-repository';
import { compare } from 'bcryptjs';
import { describe, expect, it } from 'vitest';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { RegisterUseCase } from './register';

describe('Register use case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUserRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: 'jhon doe',
      email: 'jhondoe@eamil.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUserRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: 'jhon doe',
      email: 'jhondoe@eamil.com',
      password: '123456',
    });

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with sam email twice', async () => {
    const usersRepository = new InMemoryUserRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const email = 'jhondoe@eamil.com';

    await registerUseCase.execute({
      name: 'jhon doe',
      email,
      password: '123456',
    });

    await expect(() =>
      registerUseCase.execute({
        name: 'jhon doe',
        email,
        password: '123456',
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});

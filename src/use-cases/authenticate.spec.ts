import { InMemoryUserRepository } from '@/repositories/in-memory-repository/in-memory-users-repository';
import { describe, expect, it } from 'vitest';
import { AuthenticateUseCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credential-error';

describe('Authenticate use case', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUserRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      name: 'jhon doe',
      email: 'jhondoe@email.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      email: 'jhondoe@email.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUserRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    expect(() =>
      sut.execute({
        email: 'jhondoe@email.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUserRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      name: 'jhon doe',
      email: 'jhondoe@email.com',
      password_hash: await hash('123456', 6),
    });

    expect(() =>
      sut.execute({
        email: 'jhondoe@email.com',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});

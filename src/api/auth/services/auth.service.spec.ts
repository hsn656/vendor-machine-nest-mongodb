import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { configuration } from 'src/config';
import { roles, User } from 'src/database/schemas/user.schema';
import { errorMessages } from 'src/errors/custom';
import { loginDTO, registerDTO } from '../dtos/auth.dto';
import { AuthService } from './auth.service';
import { UsersRepository } from 'src/database/repository/user.repository';

describe('AuthService', () => {
  let service: AuthService;
  const fakeUserRepository: Partial<UsersRepository> = {};
  const fakeUser: Partial<User> = {
    username: 'test name',
    password: 'password',
    role: roles.buyer,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: fakeUserRepository,
        },
      ],
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '3h' },
        }),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('AuthService: register method', () => {
    it('should throw error if user already registered', () => {
      fakeUserRepository.findOne = jest.fn().mockResolvedValueOnce(fakeUser);
      const result = service.register(fakeUser as registerDTO);
      expect(fakeUserRepository.findOne).toBeCalled();
      expect(result).rejects.toThrowError(
        errorMessages.auth.userAlreadyExist.message,
      );
    });

    it('should success', async () => {
      fakeUserRepository.findOne = jest.fn().mockResolvedValueOnce(null);
      fakeUserRepository.create = jest.fn().mockResolvedValueOnce(fakeUser);
      const result = await service.register(fakeUser as registerDTO);
      expect(fakeUserRepository.findOne).toBeCalled();
      expect(fakeUserRepository.create).toBeCalled();
      expect(result).toStrictEqual(fakeUser);
    });
  });

  describe('AuthService: login method', () => {
    it('should throw error if wrong username', () => {
      fakeUserRepository.findOne = jest.fn().mockResolvedValueOnce(null);
      const result = service.login(fakeUser as loginDTO);
      expect(fakeUserRepository.findOne).toBeCalled();
      expect(result).rejects.toThrowError(
        errorMessages.auth.wronCredentials.message,
      );
    });

    it('should throw error if wrong password', () => {
      fakeUserRepository.findOne = jest.fn().mockResolvedValueOnce(fakeUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);
      const result = service.login(fakeUser as loginDTO);
      expect(fakeUserRepository.findOne).toBeCalled();
      expect(result).rejects.toThrowError(
        errorMessages.auth.wronCredentials.message,
      );
    });

    it('should success', async () => {
      fakeUserRepository.findOne = jest.fn().mockResolvedValueOnce(fakeUser);
      bcrypt.compare = jest.fn().mockResolvedValueOnce(true);
      const result = await service.login(fakeUser as loginDTO);
      expect(fakeUserRepository.findOne).toBeCalled();
      expect(bcrypt.compare).toBeCalled();
      expect(result).toHaveProperty('accessToken');
    });
  });
});

import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { configuration } from 'src/config';
import { MongooseConfigService } from 'src/database/config';
import { User, UserSchema } from 'src/database/schemas/user.schema';
import { errorMessages } from 'src/errors/custom';
import { loginDTO, registerDTO } from '../dtos/auth.dto';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const fakeUserModel: Partial<Model<User>> = {};
  const fakeUser: Partial<User> = {
    username: 'test name',
    password: 'password',
    role: 'buyer',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: fakeUserModel,
        },
      ],
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forRootAsync({
          useClass: MongooseConfigService,
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
      fakeUserModel.findOne = jest.fn().mockResolvedValueOnce(fakeUser);
      const result = service.register(fakeUser as registerDTO);
      expect(fakeUserModel.findOne).toBeCalled();
      expect(result).rejects.toThrowError(
        errorMessages.auth.userAlreadyExist.message,
      );
    });

    it('should success', async () => {
      fakeUserModel.findOne = jest.fn().mockResolvedValueOnce(null);
      fakeUserModel.create = jest.fn().mockResolvedValueOnce(fakeUser);
      const result = await service.register(fakeUser as registerDTO);
      expect(fakeUserModel.findOne).toBeCalled();
      expect(fakeUserModel.create).toBeCalled();
      expect(result).toStrictEqual(fakeUser);
    });
  });

  describe('AuthService: login method', () => {
    it('should throw error if wrong username', () => {
      fakeUserModel.findOne = jest.fn().mockResolvedValueOnce(null);
      const result = service.login(fakeUser as loginDTO);
      expect(fakeUserModel.findOne).toBeCalled();
      expect(result).rejects.toThrowError(
        errorMessages.auth.wronCredentials.message,
      );
    });

    it('should throw error if wrong password', () => {
      fakeUserModel.findOne = jest.fn().mockResolvedValueOnce(fakeUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);
      const result = service.login(fakeUser as loginDTO);
      expect(fakeUserModel.findOne).toBeCalled();
      expect(result).rejects.toThrowError(
        errorMessages.auth.wronCredentials.message,
      );
    });

    it('should success', async () => {
      fakeUserModel.findOne = jest.fn().mockResolvedValueOnce(fakeUser);
      bcrypt.compare = jest.fn().mockResolvedValueOnce(true);
      const result = await service.login(fakeUser as loginDTO);
      expect(fakeUserModel.findOne).toBeCalled();
      expect(bcrypt.compare).toBeCalled();
      expect(result).toHaveProperty('accessToken');
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserRepository } from '../database/repositories/user.repository';
import { RoleRepository } from '../database/repositories/role.repository';
import { User } from '../database/entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let redisService: RedisService;
  let userRepository: UserRepository;
  let roleRepository: RoleRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-token'),
            decode: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            isTokenBlacklisted: jest.fn(),
            set: jest.fn(),
            get: jest.fn(),
            addToBlacklist: jest.fn(),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            findByUsername: jest.fn().mockImplementation((username) => {
              return null;
            }),
            save: jest.fn().mockImplementation(({
              username,
              password,
              role,
            }) => {
              return {
                id: 1,
                username,
                role: {
                  id: 1,
                  name: role,
                },
              };
            }),
          },
        },
        {
          provide: RoleRepository,
          useValue: {
            findByName: jest.fn().mockResolvedValue({ id: 1, name: 'admin' }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    redisService = module.get<RedisService>(RedisService);
    userRepository = module.get<UserRepository>(UserRepository);
    roleRepository = module.get<RoleRepository>(RoleRepository);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should validate a user', async () => {
    jest.spyOn(userRepository, 'findByUsername').mockResolvedValue({
      id: 1,
      username: 'testuser',
      password: await bcrypt.hash('password', 10),
      role: { id: 1, name: 'admin' },
    } as User);
    const result = await authService.validateUser(
      "testuser",
      "password", 
    );
    expect(result).toHaveProperty('id', 1);
    expect(result).toHaveProperty('username', 'testuser');
    expect(result).toHaveProperty('role', { id: 1, name: 'admin' });
  });

  it('should throw an unauthorized exception', async () => {
    jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(null);
    await expect(
      authService.validateUser('wronguser', 'wrong')
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should register a user', async () => {
    jest.spyOn(userRepository, 'save').mockResolvedValue({
      id: 1,
      username: 'testuser2',
      role: { id: 1, name: 'admin' },
    } as User);
    const result = await authService.register({
      username: 'testuser2',
      password: 'password',
      role: 'admin',
    });
    expect(result).toHaveProperty('username', 'testuser2');
    expect(result).toHaveProperty('role', { id: 1, name: 'admin' });
  });

  it('should throw a ConflictException if the username already exists', async () => {
    const mockUser = new User();
    mockUser.id = 1;
    mockUser.username = 'testuser2';
    mockUser.password = 'password';
    mockUser.role = { id: 1, name: 'admin' } as any;
    jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(mockUser);
    await expect(
      authService.register({ username: 'testuser2', password: 'password', role: 'admin' })
    ).rejects.toThrow(ConflictException);
  });

  it('should throw a BadRequestException if the role does not exist', async () => {
    jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(null);
    jest.spyOn(roleRepository, 'findByName').mockResolvedValueOnce(null);
    await expect(
      authService.register({ username: 'newuser', password: 'password2', role: 'editor' })
    ).rejects.toThrow(BadRequestException);
  });

  it('should login a user', async () => {
    jest.spyOn(authService, 'validateUser').mockResolvedValueOnce({
    username: 'testuser',
    id: 1,
    role: { id: 1, name: 'admin' }
  });
    const loginResponse = await authService.login({
      username: 'testuser',
      id: 1,
      role: { name: 'admin' },
    });
    expect(loginResponse).toHaveProperty('access_token');
    expect(loginResponse.access_token).toBe('mock-token');
  });

it('should logout a user and blacklist the token', async () => {
  const token = 'mock-token';
  jest.spyOn(jwtService, 'decode').mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 60 });
  jest.spyOn(redisService, 'addToBlacklist').mockResolvedValue(undefined);
  await authService.logout(token);
  expect(redisService.addToBlacklist).toHaveBeenCalledWith(token, expect.any(Number));
});

  it('should throw an error for invalid token during logout', async () => {
    jest.spyOn(jwtService, 'decode').mockReturnValue(null);
    const invalidToken = 'invalid-token';
    await expect(authService.logout(invalidToken)).rejects.toThrow('Invalid token');
  });
});

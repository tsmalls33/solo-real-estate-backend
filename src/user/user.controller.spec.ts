import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ConfigService } from '@nestjs/config';

describe('UserController (unit)', () => {
  let controller: UserController;
  const mockUserService = {
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({ id: 'u1', email: 'a@b.c' }),
    update: jest.fn().mockResolvedValue({ id: 'u1', email: 'x@y.z' }),
    remove: jest.fn().mockResolvedValue({ id: 'u1' }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue('10') } },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create delegates to UserService.create', async () => {
    const dto = { email: 'a@b.c', password: 'P1', full_name: 'T' };
    await controller.create(dto as any);
    expect(mockUserService.create).toHaveBeenCalledWith(dto);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RegistrationDto, LoginDto } from "../src/app.dto";
import * as faker from 'faker';

import { AppService } from '../src/app.service';
import { UsersService } from '../src/users/users.service';
import { closeInMongodConnection, rootMongooseTestModule } from './utils/set-up';
import { UserSchema } from '../src/users/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AppModule } from './../src/app.module';

describe('User Authentication', () => {
  let appService: AppService;
  // let userService: UsersService;
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
      ],
      providers: [AppService, UsersService],
    }).compile();

    appService = moduleFixture.get<AppService>(AppService);
    //appService = moduleFixture.get<UsersService>(UsersService);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  it('/', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('register user', async () => {

    const register: RegistrationDto = {
      emailAddress: faker.internet.email(),
      password: faker.lorem.word(),
      phoneNumber: faker.phone.phoneNumber(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    };

    const result = await request(app.getHttpServer())
      .post('/register')
      .set("Accept", "application/json")
      .send(register);

    expect(result.body.statusCode).toEqual(201)
    expect(result.body.message).toEqual('Registration Successful.')

  }, 600000);


  it('returns error 400 on login if user does not exist', async () => {

    const login: LoginDto = {
      emailAddress: faker.internet.email(),
      password: faker.lorem.word(),
    };

    const result = await request(app.getHttpServer())
      .post('/login')
      .set("Accept", "application/json")
      .send(login);

    expect(result.body.statusCode).toEqual(400)

  }, 600000);

  /**
    Write meaningful test
  **/ 

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
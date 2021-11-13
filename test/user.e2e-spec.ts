import { UsersModule } from './../src/users/users.module';
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


const userData = {
    emailAddress: faker.internet.email(),
    password: faker.lorem.word(),
    phoneNumber: faker.phone.phoneNumber(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
};

let user: any;

describe('User Authentication', () => {
    let appService: AppService;
    let userService: UsersService;
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AppModule,
                UsersModule,
                rootMongooseTestModule(),
                MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
            ],
            providers: [AppService, UsersService],
        }).compile();

        userService = moduleFixture.get<UsersService>(UsersService);
        user = await userService.create(userData);

        app = moduleFixture.createNestApplication();
        await app.init();

    }, 600000);



    it('should be defined', () => {
        expect(userService).toBeDefined();
    }, 600000);


    it('login user', async () => {
        const login = {
            emailAddress: userData.emailAddress,
            password: userData.password,
        };

        const result = await request(app.getHttpServer())
            .post('/login')
            .set("Accept", "application/json")
            .send(login);


        expect(result.body.statusCode).toEqual(200)
        expect(result.body.data.jwtToken).toBeDefined()

    }, 600000);


    afterAll(async () => {
        await closeInMongodConnection();
    });

});
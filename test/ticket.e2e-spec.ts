import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RegistrationDto, LoginDto } from "../src/app.dto";
import * as faker from 'faker';

import { TicketService } from '../src/tickets/tickets.service';
import { closeInMongodConnection, rootMongooseTestModule } from './utils/set-up';
import { UserSchema } from '../src/users/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AppModule } from './../src/app.module';
import { TicketSchema } from '../src/tickets/schemas/ticket.schema';
import { TicketsModule } from './../src/tickets/tickets.module';
import { EventSchema } from '../src/events/schemas/event.schema';
import { AppService } from './../src/app.service';
import { EventsModule } from './../src/events/events.module';
import { EventService } from './../src/events/events.service';
import { UsersModule } from './../src/users/users.module';

jest.setTimeout(600000) 

describe('Tickets (e2e)', () => {
    let ticketService: TicketService;
    let eventService: EventService;
    let app: INestApplication;

    let ticket:any;

    const ticketData = {
        title: faker.lorem.word(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        otherFee: faker.commerce.price(),
        eventId: "618b78a0fa62c15d968edfed"
    }

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                TicketsModule,
                AppModule,
                EventsModule,
                UsersModule,
                rootMongooseTestModule(),
                MongooseModule.forFeature([{ name: 'Ticket', schema: TicketSchema }]),
                MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]),
                MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
            ],
            providers: [AppService, TicketService],
        }).compile();

        ticketService = moduleFixture.get<TicketService>(TicketService);
        ticket = await ticketService.create({},ticketData );
        app = moduleFixture.createNestApplication();
        await app.init();
    },60000);



    it('should be defined', () => {
        expect(ticketService).toBeDefined();
    });

    it('gets all ticket', async () => {
        const result = await request(app.getHttpServer())
            .get('/ticket')
        expect(result.body.statusCode).toEqual(200);
    }, 600000);

    it("returns the ticket record if it is found", async () => {
        const result = await request(app.getHttpServer())
            .get(`/ticket/${ticket.data._id}`)
            .send()

        expect(result.body.statusCode).toEqual(200);
        expect(result.body.data).toBeDefined();
    }, 600000);
 
    
    /**
      Write meaningful test
    **/

    afterAll(async () => {
        await closeInMongodConnection();
    });
});
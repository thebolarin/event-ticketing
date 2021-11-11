import { EventsModule } from './events/events.module';
import { EventSchema } from './events/schemas/event.schema';
import { EventService } from './events/events.service';
import { EventsController } from './events/events.controller';

import { TicketSchema } from './tickets/schemas/ticket.schema';
import { TicketService } from './tickets/tickets.service';
import { TicketsController } from './tickets/tickets.controller';

import { Module, MiddlewareConsumer, RequestMethod, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { AppConfig, AppConfigValidationSchema } from './app.config';

import { UsersModule } from './users/users.module';

import { UserSchema } from './users/schemas/user.schema';

import { UsersController } from './users/users.controller';
import { TicketsModule } from './tickets/tickets.module';

import { S3Service } from './common/services/s3.service';

@Module({
  imports: [
		MongooseModule.forRootAsync(
			{
				useFactory: () => ({
					uri: AppConfig.DATABASE_URI,
					useNewUrlParser: true,
					useUnifiedTopology: true
				})
			}
		), 
	
		MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
		MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]),
		MongooseModule.forFeature([{ name: 'Ticket', schema: TicketSchema }]),
		UsersModule,
		EventsModule,
		TicketsModule
	],
	controllers: [
		AppController,
		EventsController,
		TicketsController,
		UsersController
	],
	providers: [		
		AppService,
		EventService, 
		TicketService,
		S3Service
  	],
})

export class AppModule {

	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes(
			// EventsController,
			UsersController,
			{ path: '/event/me', method: RequestMethod.GET },
			{ path: '/event', method: RequestMethod.POST },
			{ path: '/event/:eventId', method: RequestMethod.PUT },
			{ path: '/event/:eventId/status', method: RequestMethod.PUT },
			{ path: '/event/:eventId/type', method: RequestMethod.PUT },
			{ path: '/event/:eventId', method: RequestMethod.DELETE },

			{ path: '/ticket', method: RequestMethod.POST },
			{ path: '/ticket/:ticketId', method: RequestMethod.PUT },
			{ path: '/ticket/:ticketId', method: RequestMethod.DELETE },
		);
	}
}

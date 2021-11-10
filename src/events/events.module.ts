import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from './events.controller';
import { EventService } from './events.service';
import { EventSchema } from './schemas/event.schema';
import { UserSchema } from '../users/schemas/user.schema';
import { TicketSchema } from '../tickets/schemas/ticket.schema';
import { S3Service } from '../common/services/s3.service';

@Module({
	imports: [
					MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
                    MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]),
					MongooseModule.forFeature([{ name: 'Ticket', schema: TicketSchema }]),
			 ],
  	controllers: [EventsController],
	providers: [EventService, S3Service],
	exports: [EventService]
})

export class EventsModule {}

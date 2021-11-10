import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketsController } from './tickets.controller';
import { TicketService } from './tickets.service';
import { TicketSchema } from './schemas/ticket.schema';
import { EventSchema } from '../events/schemas/event.schema';

@Module({
	imports: [
					MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]),
                    MongooseModule.forFeature([{ name: 'Ticket', schema: TicketSchema }]),
			 ],
  	controllers: [TicketsController],
	providers: [TicketService],
	exports: [TicketService]
})

export class TicketsModule {}

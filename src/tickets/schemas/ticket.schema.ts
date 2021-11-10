import * as mongoose from 'mongoose';

export const TicketSchema = new mongoose.Schema({
	title: String,
    description: String,
    price: Number,
	otherFee: Number,
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
	createdAt: Date,
	updatedAt: Date,
});

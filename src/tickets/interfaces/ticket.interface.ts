import { Document, ObjectId } from 'mongoose';

export interface Ticket extends Document {
    title: String,
    description: String,
    price: Number,
	otherFee: Number,
    eventId: ObjectId,
	createdAt: Date,
	updatedAt: Date,
}

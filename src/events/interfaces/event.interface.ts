import { Document, ObjectId } from 'mongoose';


export interface Event extends Document {
    title: String,
    identifier: String,
    description: String,
    address: String,
	longitude: String,
    latitude: String,
	banner: String,
    eventType: String,
    status: String,
    date: Date,
    startTime: String, 
    tickets: Array<ObjectId>,
    endTime: String,
	instagramUrl: String,
    facebookUrl: String,
    twitterUrl: String,
    createdBy: ObjectId;
	createdAt: Date,
	updatedAt: Date,
}

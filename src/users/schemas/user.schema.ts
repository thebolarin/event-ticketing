import * as mongoose from 'mongoose';


export const UserSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	emailAddress: String,
	phoneNumber: String,
	password: { type: String, select: false },
	createdAt: Date,
	updatedAt: Date,
});

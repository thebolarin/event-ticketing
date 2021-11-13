import * as mongoose from 'mongoose';
import {  Schema } from '@nestjs/mongoose';
import { AppConfig } from "../../app.config";
import redis from '../../common/configs/redis-client';
import redisKeys from '../../common/configs/redis-key-gen';
const client = redis.getClient();

 const EventSchema = new mongoose.Schema({
    title: String,
    identifier: String,
    description: String,
    address: String,
    longitude: String,
    latitude: String,
    banner: String,
    eventType: {
        type: String,
        enum: ['FREE', 'PAID'],
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
    },
    date: Date,
    startTime: String,
    endTime: String,
    instagramUrl: String,
    facebookUrl: String,
    twitterUrl: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
    createdAt: Date,
    updatedAt: Date,
}, { toJSON: { virtuals: true } });


EventSchema.virtual('bannerUrl').get(function () {
    const bucket = AppConfig.S3_BUCKET
    const region = AppConfig.S3_REGION

    if(this.banner) return `https://${bucket}.s3-${region}.amazonaws.com/event/${this.banner}`
    return null;
    
});

EventSchema.post('save' , async function(){
    await clearCache()
});

EventSchema.post('remove' , async function(){
    await clearCache()
});



const clearCache = () => {
    const keyId = redisKeys.getKey(`events_*`);
    console.log(`Deleting products from cache....`);
    client.keys(keyId, function (err, rows) {
        rows.forEach(row => {
            client.unlink(row);
        });
    })
};


export { EventSchema };
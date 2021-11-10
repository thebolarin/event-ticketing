import { Injectable, HttpStatus } from '@nestjs/common';
import { Event } from './interfaces/event.interface';
import { Ticket } from '../tickets/interfaces/ticket.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateEventDto, UpdateEventDto, UpdateEventStatusDto, UpdateEventTypeDto } from './dto/event.dto';
import slugify from 'slugify'
import * as moment from 'moment';
import { S3Service } from '../common/services/s3.service';
import redis from '../common/configs/redis-client';
import redisKeys from '../common/configs/redis-key-gen';
const { promisify } = require('util');

const client = redis.getClient();

@Injectable()
export class EventService {
    constructor(
        @InjectModel('Event') private readonly eventModel: Model<Event>,
        @InjectModel('Ticket') private readonly ticketModel: Model<Ticket>,
        public s3Service: S3Service,
    ) { }

    async findAll(queryString: any) {

        try {
            let pageOptions = {
                page: queryString.page || 0,
                limit: (queryString.limit ? (queryString.limit > 100 ? 100 : queryString.limit) : 10),
            }

            let query: any = {};


            if (queryString.title && queryString.title != '') query.title = queryString.title;
            if (queryString.type && queryString.type != '' && ["FREE", "PAID"].indexOf(queryString.type) >= 0) query.eventType = queryString.type;
            if (queryString.status && queryString.status != '' && ["ACTIVE", "INACTIVE"].indexOf(queryString.status) >= 0) query.status = queryString.status;

            const keyId = redisKeys.getKey(`events_${pageOptions.page}_${pageOptions.limit}`);

            const fetchEventsFromDb = async () => {
                const eventsCount = await this.eventModel.countDocuments(query)
                    .exec();

                const events = await this.eventModel.find(query).populate('tickets')
                    .sort({
                        createdAt: -1
                    })
                    .skip(pageOptions.page * pageOptions.limit)
                    .limit(pageOptions.limit * 1)
                    .exec();


                client.set(keyId, JSON.stringify({ total: eventsCount, events }))
                client.expire(keyId, 60 * 120);

                return {
                    statusCode: HttpStatus.OK,
                    message: "Events fetched successfully.",
                    data: events,
                    pagination: {
                        total: eventsCount,
                        pages: Math.ceil(eventsCount / pageOptions.limit),
                        page: pageOptions.page,
                        limit: pageOptions.limit
                    }
                }
            }


            const getAsync = promisify(client.get).bind(client);
            const value = await getAsync(keyId);

            if(value){
                if (queryString.title || queryString.type || queryString.status) {
                    console.log('Fetching all events from db. Query present....')
                    return fetchEventsFromDb();
                }
                
                let result = JSON.parse(value)
                console.log('Fetching request from cache ....');
                return {
                    statusCode: HttpStatus.OK,
                    message: "Events fetched successfully.",
                    data: result.events,
                    pagination: {
                        total: result.eventsCount,
                        pages: Math.ceil(result.eventsCount / pageOptions.limit),
                        page: pageOptions.page,
                        limit: pageOptions.limit
                    }
                }
            }else{
                console.log('Empty cache.Fetching events from db ....');
                return fetchEventsFromDb();
            }
        }
        catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Invalid Request"
            }
        }

    }

    async findMyEvents(userInfo: any) {
        try {
            const events = await this.eventModel.find({
                createdBy: userInfo._id
            }).populate('tickets').exec();

            return {
                statusCode: HttpStatus.OK,
                message: "Events fetched successfully.",
                data: events
            }
        }
        catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Invalid Request"
            }
        }


    }

    async get(userInfo: any, eventId: string) {
        try {
            const event = await this.eventModel.findOne({
                _id: eventId,
            }).populate('tickets').exec();
            

            if (event !== null) {
                
                return {
                    statusCode: HttpStatus.OK,
                    message: "Event fetched successfully.",
                    data:  event
                }
            } else {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Event not found."
                }
            }
        }
        catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Invalid Request"
            }
        }

    }

    async getByIdentifier(eventIdentifier: string) {
        try {
            const event = await this.eventModel.findOne({
                identifier: eventIdentifier
            }).populate('tickets').exec();

            if (event !== null) {
                const tickets = await this.ticketModel.findOne({ eventId: event._id }).exec();

                return {
                    statusCode: HttpStatus.OK,
                    message: "Event fetched successfully.",
                    data: { event, tickets }
                }
            } else {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Event not found."
                }
            }
        }
        catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Invalid Request"
            }
        }

    }

    async create(userInfo: any, createEventDto: CreateEventDto) {
        try {
            const eventIdentifier = slugify(createEventDto.title);

            const event = new this.eventModel({
                title: createEventDto.title,
                identifier: eventIdentifier,
                description: createEventDto.description,
                address: createEventDto.address,
                longitude: createEventDto.longitude,
                latitude: createEventDto.latitude,
                banner: createEventDto.banner,
                eventType: createEventDto.eventType,
                status: createEventDto.status,
                date: createEventDto.date,
                startTime: createEventDto.startTime,
                endTime: createEventDto.endTime,
                instagramUrl: createEventDto.instagramUrl,
                facebookUrl: createEventDto.facebookUrl,
                twitterUrl: createEventDto.twitterUrl,
                createdAt: new Date(),
                createdBy: userInfo._id,
                updatedAt: new Date()
            });

            await event.save();

            return {
                statusCode: HttpStatus.OK,
                message: "Event created successfully.",
                data: event
            }
        }
        catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Invalid Request"
            }
        }


    }

    async delete(userInfo: any, eventId: string) {

        try {
            const event = await this.eventModel.findOne({
                _id: eventId,
                createdBy: userInfo._id
            }).exec();

            if (event !== null) {
                event.remove();

                return {
                    statusCode: HttpStatus.OK,
                    message: "Event Deleted successfully.",
                }
            } else {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Event not found."
                }
            }
        }
        catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Invalid Request"
            }
        }


    }

    async update(userInfo: any, eventId: string, updateEventDto: UpdateEventDto) {

        try {
            let event = await this.eventModel.findOne({
                _id: eventId,
                createdBy: userInfo._id
            }).exec();

            if (event !== null) {
                const eventIdentifier = slugify(updateEventDto.title);

                event.title = updateEventDto.title;
                event.identifier = eventIdentifier
                event.description = updateEventDto.description;
                event.address = updateEventDto.address;
                event.longitude = updateEventDto.longitude;
                event.latitude = updateEventDto.latitude;
                event.banner = updateEventDto.banner;
                event.eventType = updateEventDto.eventType,
                    event.status = updateEventDto.status,
                    event.date = updateEventDto.date;
                event.startTime = updateEventDto.startTime;
                event.endTime = updateEventDto.endTime;
                event.instagramUrl = updateEventDto.instagramUrl;
                event.facebookUrl = updateEventDto.facebookUrl;
                event.twitterUrl = updateEventDto.twitterUrl;
                event.updatedAt = new Date();
                await event.save();

                return {
                    statusCode: HttpStatus.OK,
                    message: "Event updated successfully.",
                    data: event
                }

            } else {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Event not found."
                }
            }
        } catch (err) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Invalid Request"
            }
        }
    }

    async updateStatus(userInfo: any, eventId: string, updateEventStatusDto: UpdateEventStatusDto) {
        try {
            let event = await this.eventModel.findOne({
                _id: eventId,
                createdBy: userInfo._id
            }).exec();

            if (event !== null) {
                event.status = updateEventStatusDto.status,
                event.updatedAt = new Date();
                await event.save();

                return {
                    statusCode: HttpStatus.OK,
                    message: "Event status updated successfully.",
                    data: event
                }

            } else {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Event not found."
                }
            }
        } catch (err) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Invalid Request"
            }
        }

    }

    async updateEventType(userInfo: any, eventId: string, updateEventTypeDto: UpdateEventTypeDto) {
        try {
            let event = await this.eventModel.findOne({
                _id: eventId,
                createdBy: userInfo._id
            }).exec();

            if (event !== null) {
                event.eventType = updateEventTypeDto.eventType,
                event.updatedAt = new Date();
                await event.save();

                return {
                    statusCode: HttpStatus.OK,
                    message: "Event type updated successfully.",
                    data: event
                }

            } else {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Event not found."
                }
            }
        }
        catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Invalid Request"
            }
        }
    }

    async getPresignedBannerUrl(key) {
        try {
            let makePublic = true;

            let presignedUrl: any = await this.s3Service.getPresignedUrl(`event/${key}`, 60, makePublic);

            return {
                statusCode: HttpStatus.OK,
                message: "Url generated successfully",
                data: presignedUrl
            }
        }
        catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Invalid Request"
            }
        }
    }

    async getBannerDownloadLink(eventId) {
        try {
            let event = await this.eventModel.findOne({ _id: eventId }).exec();

            if (event !== null) {
                let key = event.banner;

                let url: any = await this.s3Service.getDownloadLink(`event/${key}`, 60);

                return {
                    statusCode: HttpStatus.OK,
                    message: "url",
                    data: url
                }

            } else {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Event not found."
                }
            }
        }
        catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Invalid Request"
            }
        }
    }
}
import { Injectable, HttpStatus } from '@nestjs/common';
import { Ticket } from './interfaces/ticket.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTicketDto, UpdateTicketDto } from './dto/ticket.dto';

@Injectable()
export class TicketService {
    constructor(
        @InjectModel('Ticket')
        private readonly ticketModel: Model<Ticket>,
    ) { }

    async findAll(userInfo: any, queryString) {
        try {
            let query:any = {};

            if(queryString.eventId && queryString.eventId != '') query.eventId = queryString.eventId;

            const tickets = await this.ticketModel.find(query).exec();

            return {
                statusCode: HttpStatus.OK,
                message: "Tickets fetched successfully.",
                data: tickets
            }
        } catch (err) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Invalid Request"
            }
        }

    }

    async get(userInfo: any, ticketId: string) {
        try {
            const ticket = await this.ticketModel.findOne({
                _id: ticketId,
            }).exec();

            if (ticket !== null) {
                return {
                    statusCode: HttpStatus.OK,
                    message: "Ticket fetched successfully.",
                    data: ticket
                }
            } else {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Ticket not found."
                }
            }
        } catch (err) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Invalid Request"
            }
        }


    }

    async create(userInfo: any, createTicketDto: CreateTicketDto) {
        try {
            const ticket = new this.ticketModel({
                title: createTicketDto.title,
                description: createTicketDto.description,
                price: createTicketDto.price,
                otherFee: createTicketDto.otherFee,
                eventId: createTicketDto.eventId,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await ticket.save();

            return {
                statusCode: HttpStatus.CREATED,
                message: "Ticket created successfully.",
                data: ticket
            }
        } catch (err) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Invalid Request"
            }
        }

    }

    async delete(userInfo: any, ticketId: string) {
        try {
            const ticket = await this.ticketModel.findOne({
                _id: ticketId,
            }).exec();

            if (ticket !== null) {
                ticket.remove();

                return {
                    statusCode: HttpStatus.OK,
                    message: "Ticket Deleted successfully.",
                }
            } else {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Ticket not found."
                }
            }
        } catch (err) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Invalid Request"
            }
        }


    }

    async update(userInfo: any, ticketId: string, updateTicketDto: UpdateTicketDto) {
        try {
            let ticket = await this.ticketModel.findOne({
                _id: ticketId
            }).exec();

            if (ticket !== null) {
                ticket.title = updateTicketDto.title,
                    ticket.description = updateTicketDto.description,
                    ticket.price = updateTicketDto.price,
                    ticket.otherFee = updateTicketDto.otherFee,
                    ticket.updatedAt = new Date()


                await ticket.save();

                return {
                    statusCode: HttpStatus.OK,
                    message: "Ticket updated successfully.",
                    data: ticket
                }

            } else {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Ticket not found."
                }
            }
        } catch (err) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Invalid Request"
            }
        }

    }
}
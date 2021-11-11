import { UpdateEventStatusDto, UpdateEventTypeDto } from './../dto/event.dto';


import { Test } from "@nestjs/testing"
import { CreateEventDto, UpdateEventDto } from "../dto/event.dto";
import { EventSchema } from "../schemas/event.schema";
import { Event } from "../interfaces/event.interface";

import { EventsController } from "../events.controller"
import { EventService } from "../events.service"
import { eventStub } from "./stubs/event.stub";

jest.mock('../events.service');

describe('EventsController', () => {
    let eventsController: EventsController;
    let eventsService: EventService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [],
            controllers: [EventsController],
            providers: [EventService]
        }).compile();

        eventsController = moduleRef.get<EventsController>(EventsController);
        eventsService = moduleRef.get<EventService>(EventService);
        jest.clearAllMocks();
    })

    describe('get an event', () => {
        describe('when get is called:', () => {
            let event: Event;

            beforeEach(async () => {
                event = await eventsController.get({}, eventStub()._id)
            })

            test('then it should call eventsService', () => {
                expect(eventsService.get).toHaveBeenCalled();
                // expect(ticketsService.get).toBeCalledWith({}, ticketStub()._id);
            })

            test('then is should return an event', () => {
                expect(event).toEqual(eventStub());
            })
        })
    })

    describe('get all events', () => {
        describe('when index is called', () => {
            let events: Event[];

            beforeEach(async () => {
                events = await eventsController.index({}, {});
            })

            test('then it should call eventsService', () => {
                expect(eventsService.findAll).toHaveBeenCalled();
            })

            test('then it should return events', () => {
                expect(events).toEqual([eventStub()])
            })
        })
    })

    describe('create event', () => {
        describe('when create is called', () => {
            let event: Event;
            let createEventDto: CreateEventDto

            beforeEach(async () => {
                createEventDto = {
                    //@ts-ignore
                    title: eventStub().title,
                    //@ts-ignore
                    description: eventStub().description,
                    //@ts-ignore
                    address: eventStub().address,
                    //@ts-ignore
                    banner: eventStub().banner,
                    //@ts-ignore
                    longitude: eventStub().longitude,
                    //@ts-ignore
                    latitude: eventStub().latitude,
                    //@ts-ignore
                    eventType: eventStub().eventType,
                    //@ts-ignore
                    status: eventStub().status,
                    //@ts-ignore
                    date: eventStub().date,
                    //@ts-ignore
                    startTime: eventStub().startTime,
                    //@ts-ignore
                    endTime: eventStub().endTime,
                    //@ts-ignore
                    instagramUrl: eventStub().instagramUrl,
                    //@ts-ignore
                    facebookUrl: eventStub().facebookUrl,
                    //@ts-ignore
                }

                event = await eventsController.create({}, createEventDto);
            })


            test('then it should call eventsService', () => {
                expect(eventsService.create).toHaveBeenCalled();
                //expect(eventsService.create).toHaveBeenCalledWith({}, createEventDto);
            })

            test('then it should return a event', () => {
                expect(event).toEqual(eventStub())
            })
        })
    })

    describe('update event', () => {
        describe('when update is called', () => {
            let event: Event;
            let updateEventDto: UpdateEventDto;

            beforeEach(async () => {
                updateEventDto = {
                    title: 'tix retreat',
                    description: 'eddd',
                    address: '122 tiamiyu savage',
                    banner: 'me.jpg',
                    longitude: '2432434',
                    latitude: '3535',
                    eventType: 'FREE',
                    status: 'INACTIVE',
                    //@ts-ignore
                    date: "2021-04-03",
                    startTime: '12:04',
                    endTime: '20:40',
                    instagramUrl: 'eter',
                    facebookUrl: 'tert',
                    twitterUrl: 'dte'
                }

                event = await eventsController.update({}, eventStub()._id, updateEventDto);
            })

            test('then it should call eventsService', () => {
                expect(eventsService.update).toHaveBeenCalled();
                //expect(eventsService.update).toHaveBeenCalledWith({} , eventStub()._id, updateEventDto);
            })

            test('then it should return a event', () => {
                expect(event).toEqual(eventStub())
            })
        })
    })

    describe('update an event status', () => {
        describe('when changeStatus is called', () => {
            let event: Event;
            let updateEventStatusDto: UpdateEventStatusDto;

            beforeEach(async () => {
                updateEventStatusDto = {
                    status: 'INACTIVE',
                }

                event = await eventsController.changeStatus({}, eventStub()._id, updateEventStatusDto);
            })

            test('then it should call eventsService', () => {
                expect(eventsService.updateStatus).toHaveBeenCalled();
                //expect(eventsService.update).toHaveBeenCalledWith({} , eventStub()._id, updateEventDto);
            })

            test('then it should return a event', () => {
                expect(event).toEqual(eventStub())
            })
        })
    })

    describe('update an event type', () => {
        describe('when changeType is called', () => {
            let event: Event;
            let updateEventTypeDto: UpdateEventTypeDto;

            beforeEach(async () => {
                updateEventTypeDto = {
                    eventType: 'INACTIVE',
                }

                event = await eventsController.changeType({}, eventStub()._id, updateEventTypeDto);
            })

            test('then it should call eventsService', () => {
                expect(eventsService.updateEventType).toHaveBeenCalled();
                //expect(eventsService.update).toHaveBeenCalledWith({} , eventStub()._id, updateEventDto);
            })

            test('then it should return a event', () => {
                expect(event).toEqual(eventStub())
            })
        })
    })

    describe('update an event type', () => {
        describe('when changeType is called', () => {
            let event: Event;
            let updateEventTypeDto: UpdateEventTypeDto;

            beforeEach(async () => {
                updateEventTypeDto = {
                    eventType: 'INACTIVE',
                }

                event = await eventsController.changeType({}, eventStub()._id, updateEventTypeDto);
            })

            test('then it should call eventsService', () => {
                expect(eventsService.updateEventType).toHaveBeenCalled();
                //expect(eventsService.update).toHaveBeenCalledWith({} , eventStub()._id, updateEventDto);
            })

            test('then it should return a event', () => {
                expect(event).toEqual(eventStub())
            })
        })
    })

    describe('delete an event', () => {
        describe('when delete is called', () => {
            let event: Event;

            beforeEach(async () => {

                event = await eventsController.delete({}, eventStub()._id);
            })

            test('then it should call eventsService', () => {
                expect(eventsService.delete).toHaveBeenCalled();
            })

           
        })
    })


})





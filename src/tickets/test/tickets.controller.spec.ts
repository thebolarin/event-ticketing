
import { Test } from "@nestjs/testing"
import { CreateTicketDto, UpdateTicketDto } from "../dto/ticket.dto";
import { TicketSchema } from "../schemas/ticket.schema";
import { Ticket } from "../interfaces/ticket.interface";

import { TicketsController } from "../tickets.controller"
import { TicketService } from "../tickets.service"
import { ticketStub } from "./stubs/ticket.stub";

jest.mock('../tickets.service');

describe('TicketsController', () => {
  let ticketsController: TicketsController;
  let ticketsService: TicketService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [TicketsController],
      providers: [TicketService]
    }).compile();

    ticketsController = moduleRef.get<TicketsController>(TicketsController);
    ticketsService = moduleRef.get<TicketService>(TicketService);
    jest.clearAllMocks();
  })

  describe('get a ticket', () => {
    describe('when get is called:', () => {
      let ticket: Ticket;

      beforeEach(async () => {
        ticket = await ticketsController.get({},ticketStub()._id) 
      })

      test('then it should call ticketsService', () => {
        expect(ticketsService.get).toHaveBeenCalled();
       // expect(ticketsService.get).toBeCalledWith({}, ticketStub()._id);
      })

      test('then is should return a ticket', () => {
        expect(ticket).toEqual(ticketStub());
      })
    })
  })

  describe('get all tickets', () => {
    describe('when index is called', () => {
      let tickets: Ticket[];

      beforeEach(async () => {
        tickets = await ticketsController.index({}, {});
      })

      test('then it should call ticketsService', () => {
        expect(ticketsService.findAll).toHaveBeenCalled();
      })

      test('then it should return tickets', () => {
        expect(tickets).toEqual([ticketStub()])
      })
    })
  })

  describe('create ticket', () => {
    describe('when create is called', () => {
      let ticket: Ticket;
      let createTicketDto: CreateTicketDto

      beforeEach(async () => {
        createTicketDto = {
            //@ts-ignore
            title: ticketStub().title,
            //@ts-ignore
            description: ticketStub().description,
            //@ts-ignore
            price: ticketStub().price,
            //@ts-ignore
            otherFee: ticketStub().otherFee,
            //@ts-ignore
            eventId : ticketStub().eventId,
          }

        ticket = await ticketsController.create({} , createTicketDto);
      })


      test('then it should call ticketsService', () => {
        expect(ticketsService.create).toHaveBeenCalled();
        //expect(ticketsService.create).toHaveBeenCalledWith({}, createTicketDto);
      })

      test('then it should return a ticket', () => {
        expect(ticket).toEqual(ticketStub())
      })
    })
  })

  describe('update ticket', () => {
    describe('when update is called', () => {
      let ticket: Ticket;
      let updateTicketDto: UpdateTicketDto;

      beforeEach(async () => {
        updateTicketDto = {
            "title": "VIP",
            "description": "lorem ipsum",
            "price": 20,
            "otherFee": 10,
        }

        ticket = await ticketsController.update({} , ticketStub()._id, updateTicketDto);
      })

      test('then it should call ticketsService', () => {
        expect(ticketsService.update).toHaveBeenCalled();
        //expect(ticketsService.update).toHaveBeenCalledWith({} , ticketStub()._id, updateTicketDto);
      })

      test('then it should return a ticket', () => {
        expect(ticket).toEqual(ticketStub())
      })
    })
  })
})



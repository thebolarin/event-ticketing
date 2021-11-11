import { ticketStub } from "../test/stubs/ticket.stub";


export const TicketService = jest.fn().mockReturnValue({
  get: jest.fn().mockResolvedValue(ticketStub()),
  findAll: jest.fn().mockResolvedValue([ticketStub()]),
  create: jest.fn().mockResolvedValue(ticketStub()),
  update: jest.fn().mockResolvedValue(ticketStub()),
})


import { eventStub } from "../test/stubs/event.stub";


export const EventService = jest.fn().mockReturnValue({
  get: jest.fn().mockResolvedValue(eventStub()),
  findAll: jest.fn().mockResolvedValue([eventStub()]),
  create: jest.fn().mockResolvedValue(eventStub()),
  update: jest.fn().mockResolvedValue(eventStub()),
  updateStatus: jest.fn().mockResolvedValue(eventStub()),
  updateEventType: jest.fn().mockResolvedValue(eventStub()),
  delete: jest.fn().mockResolvedValue(eventStub()),
})


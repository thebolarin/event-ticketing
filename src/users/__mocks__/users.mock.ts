import { userStub } from "../test/stubs/user.stub";


export const UserService = jest.fn().mockReturnValue({
  get: jest.fn().mockResolvedValue(userStub()),
  findAll: jest.fn().mockResolvedValue([userStub()]),
  create: jest.fn().mockResolvedValue(userStub()),
  update: jest.fn().mockResolvedValue(userStub()),
  updateStatus: jest.fn().mockResolvedValue(userStub()),
  updateEventType: jest.fn().mockResolvedValue(userStub()),
  delete: jest.fn().mockResolvedValue(userStub()),
})


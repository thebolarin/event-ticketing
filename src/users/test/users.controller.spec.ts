import { Test } from "@nestjs/testing"
import { UserSchema } from "../schemas/user.schema";
import { User } from "../interfaces/user.interface";

import { UsersController } from "../users.controller"
import { UsersService } from "../users.service"
import { userStub } from "./stubs/user.stub";

jest.mock('../users.service');

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [UsersService]
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
    jest.clearAllMocks();
  })

  describe('get a user', () => {
    describe('when get is called:', () => {
      let user //: User;

      beforeEach(async () => {
        user = await usersController.get({},userStub()._id) 
      })

      
      test('then it should call usersService', () => {
        expect(usersService.get).toHaveBeenCalled();
      })
    })
  })

})

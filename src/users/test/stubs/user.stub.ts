import { User } from "../../interfaces/user.interface";

export const userStub = (): User => {
    return {
        _id: "61899841ceb97060210bae6e",
        firstName: "abs",
        lastName: "tester",
        emailAddress: "abc@testing.com",
        phoneNumber: "000000000000",
        password: "sfsce",
        //@ts-ignore
        createdAt: "2021-11-08T21:36:01.265Z",
        //@ts-ignore
        updatedAt: "2021-11-08T21:36:01.265Z",
      }

}



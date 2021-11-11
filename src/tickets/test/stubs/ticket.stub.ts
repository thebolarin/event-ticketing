import { Ticket } from "../../interfaces/ticket.interface";

export const ticketStub = (): Ticket => {
    return {
        _id: '618b78a0fa62c15d968edfed',
        title: "new title",
        description: "ticket description",
        price: 20,
        otherFee: 10,
        //@ts-ignore
        eventId: "618b78a0fa62c15d968edfed"
    }
}
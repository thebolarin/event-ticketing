import { Controller, Get, Post, Put,Delete, Body, Query,Request, Param,ValidationPipe, UsePipes } from '@nestjs/common';
import { TicketService } from './tickets.service';
import { Ticket } from './interfaces/ticket.interface';
import { HttpStatus } from '@nestjs/common';
import { CreateTicketDto, GetTicketDto, UpdateTicketDto } from './dto/ticket.dto';

@Controller('ticket')
export class TicketsController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  async index(@Request() request,@Query() queryString): Promise<any> {
    return await this.ticketService.findAll(request.decoded,queryString);
  }

  @Get(':ticketId')
  async get(@Request() request,@Param() params: GetTicketDto): Promise<any> {
    return await this.ticketService.get(request.decoded, params.ticketId);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Request() request, @Body() createTicketDto : CreateTicketDto): Promise<any> {
    return await this.ticketService.create(request.decoded, createTicketDto);
  }

  @Put(':ticketId')
  async update(@Request() request, @Param() params: GetTicketDto, @Body() updateTicketDto: UpdateTicketDto): Promise<any> {
    return await this.ticketService.update(request.decoded, params.ticketId, updateTicketDto);
  }

  @Delete(':ticketId')
  @UsePipes(new ValidationPipe({ transform: true }))
  async delete(@Request() request, @Param() params: GetTicketDto): Promise<any> {
    return await this.ticketService.delete(request.decoded, params.ticketId);
  }
}

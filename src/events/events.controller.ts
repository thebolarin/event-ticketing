import { Controller, Get, Post, Put,Delete, Body, Query,Request, Param,ValidationPipe, UsePipes } from '@nestjs/common';
import { EventService } from './events.service';
import { Event } from './interfaces/event.interface';
import { HttpStatus } from '@nestjs/common';
import { CreateEventDto, GetEventDto, UpdateEventDto, UpdateEventStatusDto, UpdateEventTypeDto, GetEventByIdentifierDto } from './dto/event.dto';


@Controller('event')
export class EventsController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async index(@Request() request, @Query() queryString): Promise<any> {
    return await this.eventService.findAll(queryString);
  }

  @Get('/me')
  async myEvents(@Request() request): Promise<any> {
    return await this.eventService.findMyEvents(request.decoded);
  }

  @Get(':eventId')
  async get(@Request() request,@Param() params: GetEventDto): Promise<any> {
    return await this.eventService.get(request.decoded, params.eventId);
  }

  @Get('get-presigned-url/:key')
  async getPresignedUrl(@Request() request,@Param('key') key): Promise<any> {
    return await this.eventService.getPresignedBannerUrl(key);
  }


  @Get('banner-download-link/:eventId')
  async getBannerDownloadLink(@Param('eventId') eventId): Promise<any> {
    return await this.eventService.getBannerDownloadLink(eventId);
  }


  @Get('i/:eventIdentifier')
  async getByIdentifier(@Param() params: GetEventByIdentifierDto): Promise<any> {
    return await this.eventService.getByIdentifier(params.eventIdentifier);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Request() request, @Body() createEventDto : CreateEventDto): Promise<any> {
    return await this.eventService.create(request.decoded, createEventDto);
  }

  @Put(':eventId')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Request() request, @Param() params: GetEventDto, @Body() updateEventDto: UpdateEventDto): Promise<any> {
    return await this.eventService.update(request.decoded, params.eventId, updateEventDto);
  }

  @Put(':eventId/status')
  @UsePipes(new ValidationPipe({ transform: true }))
  async changeStatus(@Request() request, @Param() params: GetEventDto, @Body() updateEventStatusDto: UpdateEventStatusDto): Promise<any> {
    return await this.eventService.updateStatus(request.decoded, params.eventId, updateEventStatusDto);
  }

  @Put(':eventId/type')
  @UsePipes(new ValidationPipe({ transform: true }))
  async changeType(@Request() request, @Param() params: GetEventDto, @Body() updateEventTypeDto: UpdateEventTypeDto): Promise<any> {
    return await this.eventService.updateEventType(request.decoded, params.eventId, updateEventTypeDto);
  }

  @Delete(':eventId')
  @UsePipes(new ValidationPipe({ transform: true }))
  async delete(@Request() request, @Param() params: GetEventDto): Promise<any> {
    return await this.eventService.delete(request.decoded, params.eventId);
  }
}

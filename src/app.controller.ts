import { Body, Controller, Delete, Get, Param, Post, Request } from '@nestjs/common';
import { LoginDto, RegistrationDto,} from './app.dto';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/register')
	async register(@Body() registrationDto: RegistrationDto): Promise<any> {
		return await this.appService.register(registrationDto);
	}

	@Post('/login')
	async login(@Body() loginDto: LoginDto, @Request() request): Promise<any> {
		return await this.appService.login(loginDto, request);
	}
}

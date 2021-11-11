import { Controller, Body, Param, Get, Post, Put, Request, Delete, UseGuards,ValidationPipe, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { ChangePasswordDto, CreateUserDto, GetUserDto, UpdateUserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}	

	@Get()
	async getAll(@Request() request) {
		return await this.usersService.getAll(request.decoded);
	}

	@Get(':userId')
	async get(@Request() request, @Param() params: GetUserDto) {
		return await this.usersService.get(params.userId);
	}

	@Put(':userId')
	@UsePipes(new ValidationPipe({ transform: true }))
	async update(@Request() request, @Param() params: GetUserDto, @Body() updateUserDto: UpdateUserDto) {
		return await this.usersService.update(params.userId, updateUserDto);
	}

	@Post('change-password')
	async changePassword(@Request() request, @Body() changePasswordDto: ChangePasswordDto) {
		return await this.usersService.changePassword(request.decoded, changePasswordDto);
	}

	@Delete(':userId')
	async delete(@Request() request, @Param() params: GetUserDto) {
		return await this.usersService.delete(params.userId);
	}	
}

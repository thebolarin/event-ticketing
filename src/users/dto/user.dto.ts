import { IsIn, IsString, IsNotEmpty, IsObject, MinLength, MaxLength, IsEmail } from 'class-validator';


export class CreateUserDto {

	@IsString()
	@IsNotEmpty()
	readonly firstName: string;

	@IsString()
	@IsNotEmpty()
	readonly lastName: string;

	@IsString()
	@IsNotEmpty()
	@IsEmail()
	readonly emailAddress: string;

	@IsString()
	@IsNotEmpty()
	readonly phoneNumber: string;

	@IsString()
	@IsNotEmpty()
	readonly password: string;
}


export class GetUserDto {
	@IsString()
	@MinLength(24)
	@MaxLength(24)
	readonly userId: string;
}

export class UpdateUserDto {
	@IsString()
	@IsNotEmpty()
	readonly firstName: string;

	@IsString()
	@IsNotEmpty()
	readonly lastName: string;

	@IsString()
	@IsNotEmpty()
	readonly phoneNumber: string;
}

export class ChangePasswordDto {
	@IsString({
		message: 'Old Password is required.'
	})
	@IsNotEmpty()
	readonly oldPassword: string;

	@IsString({
		message: 'New Password is required.'
	})
	@IsNotEmpty()
	readonly newPassword: string;
}
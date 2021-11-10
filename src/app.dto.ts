import { IsIn, IsString, IsMongoId, IsNotEmpty, IsObject, MinLength, MaxLength, ValidateIf, ValidateNested } from 'class-validator';


export class RegistrationDto {
	@IsString({
		message: 'Email is required.'
	})
	readonly emailAddress: String;

	@IsString({
		message: 'Password is required.'
	})
	readonly password: String;

    @IsString({
		message: 'Phone Number is required.'
	})
	readonly phoneNumber: String;

	@IsString({
		message: 'First Name is required.'
	})
	readonly firstName: String;

	@IsString({
		message: 'Last Name is required.'
	})
	readonly lastName: String;
}

export class LoginDto {
	@IsString({
		message: 'Password is required.'
	})
	readonly password: String;

	readonly emailAddress: String;
}

export class ResetPasswordDto {
	@IsString({
		message: 'Email is required.'
	})
	readonly emailAddress: String;

	readonly password: String;
	readonly resetToken: String;
}


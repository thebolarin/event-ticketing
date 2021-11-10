import { IsIn, IsString, IsDate, IsNotEmpty,IsNumber, IsObject, MinLength, MaxLength } from 'class-validator';


export class CreateTicketDto {

	@IsString()
	@IsNotEmpty()
	readonly title: string;

	@IsString()
	@IsNotEmpty()
	readonly description: string;

	@IsNumber()
	@IsNotEmpty()
	readonly price: number;

	@IsNumber()
	@IsNotEmpty()
	readonly otherFee: number;

	@IsString()
	@IsNotEmpty()
	readonly eventId: string;

}

export class GetTicketDto {
	@IsString()
	@MinLength(24)
	@MaxLength(24)
	readonly ticketId: string;
}

export class UpdateTicketDto {
	
	@IsString()
	@IsNotEmpty()
	readonly title: string;

	@IsString()
	@IsNotEmpty()
	readonly description: string;

	@IsNumber()
	@IsNotEmpty()
	readonly price: number;

	@IsNumber()
	@IsNotEmpty()
	readonly otherFee: number;

	// @IsString()
	// @IsNotEmpty()
	//readonly eventId: string;
}
import { IsIn, IsString, IsEnum,ValidateIf, IsDate, IsNotEmpty, IsObject,IsDateString, MinLength, MaxLength } from 'class-validator';

export class CreateEventDto {

	@IsString()
	@IsNotEmpty()
	readonly title: string;

	@IsString()
	@IsNotEmpty()
	readonly description: string;

	@IsString()
	@IsNotEmpty()
	readonly address: string;

	@IsString()
	@IsNotEmpty()
	readonly longitude: string;

	@IsString()
	@IsNotEmpty()
	readonly latitude: string;

    @IsString()
	@IsNotEmpty()
	readonly banner: string;

	@IsIn(['FREE','PAID'], {
		message: 'Event Status must either be FREE or PAID.'
	})
	@IsString({
		message: 'Event Type is required.'
	})
	readonly eventType: string;

	@IsIn(['ACTIVE','INACTIVE'], {
		message: 'Event Status must either be ACTIVE or INACTIVE.'
	})
	@IsString({
		message: 'Event Status is required.'
	})
	readonly status: string;

	@IsNotEmpty()
	@IsDateString()
	readonly date: Date;

	@IsString()
	@IsNotEmpty()
	readonly startTime: Date;

	@IsString()
	@IsNotEmpty()
	readonly endTime: Date;

	@IsString()
	@IsNotEmpty()
	readonly instagramUrl: string;

	@IsString()
	@IsNotEmpty()
	readonly facebookUrl: string;

	@IsString()
	@IsNotEmpty()
	readonly twitterUrl: string;
}

export class GetEventDto {
	@IsString()
	@MinLength(24)
	@MaxLength(24)
	readonly eventId: string;
}


export class GetEventByIdentifierDto {
	@IsString()
	readonly eventIdentifier: string;
}

export class UpdateEventStatusDto {
	@IsIn(['ACTIVE','INACTIVE'], {
		message: 'Event Status must either be ACTIVE or INACTIVE.'
	})
	@IsString({
		message: 'Event Status is required.'
	})
	readonly status: String;
}



// @IsIn(['BVN'], {
// 	message: 'Identity type must be BVN.'
// })
// @IsString({
// 	message: 'Identity Type is required.'
// })
// readonly type: String;

// @IsMongoId({
// 	message: 'Identity Id is required.'
// })



export class UpdateEventTypeDto {
	@IsIn(['FREE','PAID'], {
		message: 'Event Status must either be FREE or PAID.'
	})
	@IsString({
		message: 'Event Type is required.'
	})
	readonly eventType: string;
}

export class UpdateEventDto {
	@IsString()
	@IsNotEmpty()
	readonly title: string;

	@IsString()
	@IsNotEmpty()
	readonly description: string;

	@IsString()
	@IsNotEmpty()
	readonly address: string;

	@IsString()
	@IsNotEmpty()
	readonly longitude: string;

	@IsString()
	@IsNotEmpty()
	readonly latitude: string;

    @IsString()
	@IsNotEmpty()
	readonly banner: string;

	@IsString()
	@IsNotEmpty()
	readonly eventType: string;

	@IsString()
	@IsNotEmpty()
	readonly status: string;

    // @IsString()
	@IsNotEmpty()
	@IsDateString()
	readonly date: Date;

	@IsString()
	@IsNotEmpty()
	readonly startTime: string;

	@IsString()
	@IsNotEmpty()
	readonly endTime: string;

	@IsString()
	@IsNotEmpty()
	readonly instagramUrl: string;

	@IsString()
	@IsNotEmpty()
	readonly facebookUrl: string;

	@IsString()
	@IsNotEmpty()
	readonly twitterUrl: string;
}
import * as dotenv from 'dotenv';

dotenv.config();

export const AppConfig: any = process.env;

import * as Joi from 'joi';

export const AppConfigValidationSchema = Joi.object({
	NODE_ENV: Joi.string()
	  .valid('development', 'production', 'test', 'provision')
	  .default('development'),
	NAME: Joi.string().required(),
	PORT: Joi.number().required(),

	APP_WEBSITE_URL: Joi.string().required(),
	APP_API_URL: Joi.string().required(),

	APPLICATION_KEY: Joi.string().required(),

	DATABASE_URI: Joi.string().required(),

	S3_ACCESS_KEY_ID: Joi.string().required(),
	S3_SECRET_ACCESS_KEY: Joi.string().required(),
	S3_BUCKET: Joi.string().required(),
	S3_REGION: Joi.string().required(),
});

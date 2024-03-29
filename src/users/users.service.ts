import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { AppConfig } from '../app.config';

import { ChangePasswordDto, CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
	constructor(@InjectModel('User') private readonly userModel: Model<User>,
                ) {}

	async getAll(userInfo: any) {
		try{
			const users = await this.userModel.find({}).exec();

			return {
				statusCode: HttpStatus.OK,
				message: "Users fetched successfully.",
				data: users
			}
		}catch(err){
			return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Invalid Request"
            }
		}
		
	}

	async get(userId: String) {
		try{
			const user = await this.userModel.findOne({
				_id: userId,
			}).exec();
	
			if(user !== null) {
				return {
					statusCode: HttpStatus.OK,
					message: "User fetched successfully.",
					data: user
				}
			}else {
				return {
					statusCode: HttpStatus.BAD_REQUEST,
					message: "User not found."
				}
			}
		}catch(err){
			return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Invalid Request"
            }
		}
		
	}

	async create(createUserDto: CreateUserDto) {
		try {
			let findUser = await this.userModel.findOne({
				emailAddress: createUserDto.emailAddress,
			}).exec();

			if (findUser === null) {
				const hashedPassword = await bcrypt.hash("" + createUserDto.password, 10);
				const userData = {
					firstName: createUserDto.firstName,
					lastName: createUserDto.lastName,
					emailAddress: createUserDto.emailAddress,
					phoneNumber: createUserDto.phoneNumber,
					password: hashedPassword,
					createdAt: new Date(),
					updatedAt: new Date()
				}

				const user = new this.userModel(userData);

				await user.save();

				return {
					statusCode: HttpStatus.CREATED,
					message: "User Created Successful.",
					data: user
				}

			} else {
				return {
					statusCode: HttpStatus.BAD_REQUEST,
					message: "User not found."
				}
			}
		} catch (err) {
			return {
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: "Invalid Request"
			}
		}

	}

	async update(userId: String, updateUserDto: UpdateUserDto) {
		try{
			let user = await this.userModel.findOne({
				_id: userId,
			}).exec();
	
			if(user !== null) {
				user.firstName = updateUserDto.firstName,
				user.lastName = updateUserDto.lastName,
				user.phoneNumber = updateUserDto.phoneNumber,
				user.updatedAt = new Date();
				await user.save();
	
				return {
					statusCode: HttpStatus.OK,
					message: "User updated successfully.",
					data: user
				}
				
			}else {
				return {
					statusCode: HttpStatus.BAD_REQUEST,
					message: "User not found."
				}
			}
		}catch(err){
			return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Invalid Request"
            }
		}
		
	}

	async delete(userId: String) {
		try{
			let user = await this.userModel.findOne({
				_id: userId,
			}).exec();
	
			if(user !== null) {
					await user.remove();
	
					return {
						statusCode: HttpStatus.OK,
						message: "User deleted successfully."
					}
			}else {
				return {
					statusCode: HttpStatus.BAD_REQUEST,
					message: "User not found."
				}
			}
		}catch(err){
			return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Invalid Request"
            }
		}
		
	}


	async changePassword(userInfo: any, changePasswordDto: ChangePasswordDto) {
		try{
			const user = await this.userModel.findOne({
				_id: userInfo._id,
			}).select('password').exec();
	
			let isMatch = await bcrypt.compare("" + changePasswordDto.oldPassword, "" + user.password);
					
			if(isMatch) {
				let hashedPassword = await bcrypt.hash("" + changePasswordDto.newPassword, 10);
	
				await this.userModel.updateOne({
					_id: userInfo._id
				}, {
					password: hashedPassword
				}).exec();
	
				return {
					statusCode: HttpStatus.OK,
					message: "Your password has been changed successfully."
				}
			}else {
				return {
					statusCode: HttpStatus.BAD_REQUEST,
					message: "Your old password is incorrect. Please try again."
				}
			}
		}catch(err){
			return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Invalid Request"
            }
		}
		
	}

}

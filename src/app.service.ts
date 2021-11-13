import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { LoginDto, RegistrationDto } from './app.dto';
import { AppConfig } from './app.config';

import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { User } from './users/interfaces/user.interface';

@Injectable()
export class AppService {

  constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

  getHello(): string {
    return 'Hello World!';
  }

  async register(registrationDto: RegistrationDto) {
    try {
      let findUser = await this.userModel.findOne({
        emailAddress: registrationDto.emailAddress,
        isDeleted: false
      }).exec();

      if (findUser === null) {

        const hashedPassword = await bcrypt.hash("" + registrationDto.password, 10);
        const userData = {
          firstName: this.formatName(registrationDto.firstName),
          lastName: this.formatName(registrationDto.lastName),
          emailAddress: registrationDto.emailAddress,
          phoneNumber: registrationDto.phoneNumber,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        const user = new this.userModel(userData);

        await user.save();

        return {
          statusCode: HttpStatus.CREATED,
          message: "Registration Successful."
        }
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "User email already exist."
        }
      }
    } catch (err) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Invalid Request"
      }
    }

  }

  async login(loginDto: LoginDto, request) {
    try {
      let user = await this.userModel.findOne({
        emailAddress: loginDto.emailAddress,
      }).select('firstName lastName emailAddress phoneNumber password').exec();

      if (user != null) {
        let isMatch = await bcrypt.compare("" + loginDto.password, "" + user.password);

        if (isMatch) {
          let user = await this.userModel.findOne({
            emailAddress: loginDto.emailAddress
          }).exec();

          let jwtToken = await jwt.sign(JSON.parse(JSON.stringify(user)), AppConfig.APPLICATION_KEY, {
            expiresIn: "1d" //30m
          });

          return {
            statusCode: HttpStatus.OK,
            message: "User login successful",
            data: {
              user,
              jwtToken
            }
          };

        } else {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: "Your Email/Password is incorrect. Please try again."
          }
        }
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Your Email/Password is incorrect. Please try again."
        }
      }
    } catch (err) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Invalid Request"
      }
    }

  }

  formatName(name) {
    if (name) {
      let firstChar = name.substr(0, 1).toUpperCase();
      let restOfChar = name.substr(1).toLowerCase();

      return firstChar + restOfChar;
    } else {
      return "";
    }
  }
}

import { Injectable, HttpStatus } from '@nestjs/common';
import { AppConfig } from '../../app.config';
import { S3, Transfer } from 'aws-sdk';

@Injectable()
export class S3Service {
  constructor() { }

  /**
   * Send Response
   * @param {string} key file name
   * @param {number} seconds Expiry time
   * @param {boolean} makePublic Publicity status of the file
   */
  async getPresignedUrl(key: string, seconds = 60, makePublic = false) {
    try {

      let s3 = new S3({
        accessKeyId: AppConfig.S3_ACCESS_KEY_ID,
        secretAccessKey: AppConfig.S3_SECRET_ACCESS_KEY,
        signatureVersion: 'v4',
        region: AppConfig.S3_REGION
      });

      let params = {
        Bucket: AppConfig.S3_BUCKET,
        Key: key,
        Expires: seconds,
        ACL: makePublic ? 'public-read' : 'private'
      };

      let url = await s3.getSignedUrl('putObject', params);

      return {
        statusCode: HttpStatus.OK,
        data: url,
      };

    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid request. Please try again.'
      };
    }
  };

  /**
   * Send Response
   * @param {string} key file name
   * @param {number} seconds Expiry time
   */
  async getDownloadLink(key: string, seconds = 60) {
    try {
      let s3 = new S3({
        accessKeyId: AppConfig.S3_ACCESS_KEY_ID,
        secretAccessKey: AppConfig.S3_SECRET_ACCESS_KEY,
        signatureVersion: 'v4',
        region: AppConfig.S3_REGION
      });

      let params = {
        Bucket: AppConfig.S3_BUCKET,
        Key: key,
        Expires: seconds
      };

      let url = await s3.getSignedUrl('getObject', params)

      return {
        statusCode: HttpStatus.OK,
        data: url,
      };

    } catch (error) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid request. Please try again.'
        };
    }
  };

}

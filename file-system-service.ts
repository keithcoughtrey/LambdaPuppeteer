export interface FileSystemService {

    read(path: string): Promise<Buffer>;

    save(data: Buffer, path: string): Promise<any>;
}

import fs = require('fs');

// Each Lambda function receives 500MB of non-persistent disk space in its own /tmp directory - see https://aws.amazon.com/lambda/faqs/.
export class LambdaFileSystemService implements FileSystemService {

    public read(path: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (error, data) => {
                if (error) {
                    console.log(`Read file returned error ${JSON.stringify(error, null, 4)}`);
                    reject(error);
                } else {
                    console.log(`Read file returned result of length ${data.length}`);
                    resolve(data);
                }
            });
        });
    }

    public save(data: Buffer, path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log(`Writing file to ${path}`);
            fs.writeFile(path, data, error => {
                if (error) {
                    console.log(`Write file returned error ${JSON.stringify(error, null, 4)}`);
                    reject(error);
                } else {
                    console.log(`Write file was successful`);
                    resolve({});
                }
            });
        });
    }

}
import * as AWS from 'aws-sdk';

export class S3FileSystemService implements FileSystemService {

  public read(path: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      console.log(`Reading file from ${path}`);
      const bucket = process.env.STEP_FUNCTIONS_DATA_BUCKET;
      const s3 = new AWS.S3();
      s3.getObject({
        Bucket: bucket,
        Key: path,
      }, (err, s3data) => {
        if (err) {
          console.log('Error', err);
          reject(err);
        } else {
          const buffer = s3data.Body as Buffer;
          resolve(buffer);
        }
      });
    });
  }

  public save(data: Buffer, path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const bucket = process.env.STEP_FUNCTIONS_DATA_BUCKET;
      console.log(`Writing file to ${path}`);
      const s3 = new AWS.S3();
      s3.upload({
        Bucket: bucket,
        Key: path,
        Body: data,
      }, (err, s3data) => {
        if (err) {
          console.log('Error', err);
          reject(err);
        } else {
          console.log(`S3 save ${JSON.stringify(s3data, null, 4)}`);
          resolve(s3data);
        }
      });
    });
  }

}


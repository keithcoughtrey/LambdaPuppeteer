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

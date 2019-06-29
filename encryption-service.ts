import { FileSystemService, LambdaFileSystemService } from './file-system-service';

export interface EncryptionService {
    encryptPdf(data: Buffer, userPassword: string, ownerPassword: string): Promise<Buffer>;
}

import childProcess = require('child_process');

export class QpdfEncryptionService implements EncryptionService {

    private fileSystemService: FileSystemService;

    constructor(fileSystemService: FileSystemService = new LambdaFileSystemService()) {
        this.fileSystemService = fileSystemService;
      }

    public async encryptPdf(data: Buffer, userPassword: string, ownerPassword: string): Promise<Buffer> {

        process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}/bin`;
        process.env.LD_LIBRARY_PATH = `${process.env.LAMBDA_TASK_ROOT}/sharedlib`;

        await this.fileSystemService.save(data, `/tmp/report.pdf`);
        const encryptedFilePath = await this.encrypt(`/tmp/report.pdf`, `/tmp/encrypted-report.pdf`, userPassword, ownerPassword);
        const encryptedBuffer = await this.fileSystemService.read(encryptedFilePath);
        return encryptedBuffer;
    }

    private encrypt(pathOfFileToEncrypt: string, pathOfEncryptedFile: string, userPassword: string, ownerPassword: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const qpdf = childProcess.spawn('qpdf',
                ['--encrypt', userPassword, ownerPassword, '256', '--modify=none', '--', pathOfFileToEncrypt, pathOfEncryptedFile]);

            qpdf.stdout.on('data', data => {
                console.log(`stdout: ${data}`);
            });

            qpdf.stderr.on('data', data => {
                console.log(`stderr: ${data}`);
                reject(data);
            });

            qpdf.on('close', code => {
                console.log(`child process exited with code ${code}`);
                if (code === 0) {
                    resolve(pathOfEncryptedFile);
                } else {
                    reject(`Exit code ${code}`);
                }
            });
        });
    }

}

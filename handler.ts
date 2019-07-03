import { CreatePdfRequest } from './create-pdf-request';
import { EmailService, NodeEmailService } from './email-service';
import { EncryptionService, QpdfEncryptionService } from './encryption-service';
import { FileSystemService, S3FileSystemService } from './file-system-service';
import { ChromePdfService, PdfService } from './pdf-service';

const pdfService: PdfService = new ChromePdfService();
const encryptionService: EncryptionService = new QpdfEncryptionService();
const fileSystemService: FileSystemService = new S3FileSystemService();
const emailService: EmailService = new NodeEmailService();

const s3path = `/pdf-reports/`;

module.exports.generatePdf = async (event, context, callback) => {
  console.log(`pdfReport request ${JSON.stringify(event, null, 4)}`);
  const request = event as CreatePdfRequest;
  const pdf = await pdfService.getPdf(request.url);
  const path = `${s3path}/${request.reportName}.pdf`;
  await fileSystemService.save(pdf, path);

  callback(null, path);
};

module.exports.encrypt = async (event, context, callback) => {
  const request = event as CreatePdfRequest;
  const pdf = await fileSystemService.read(request.pdfFilePath);
  const encrypted = await encryptionService.encryptPdf(pdf, request.userPassword || '', request.ownerPassword || '');
  const path = `${s3path}/${request.reportName}-encrypted.pdf`;
  await fileSystemService.save(encrypted, path);
  callback(null, path );
};

module.exports.emailPdfReport = async (event, context, callback) => {
  const request = event as CreatePdfRequest;
  const pdf = await fileSystemService.read(request.encryptedFilePath || request.pdfFilePath);
  await emailService.send(request.toAddress, 'Report attached', `Please find your pdf of ${request.url} attached`, pdf.toString('base64'));
  callback(null, { });
};

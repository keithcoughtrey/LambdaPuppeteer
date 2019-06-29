import { EncryptionService, QpdfEncryptionService } from './encryption-service';
import { ChromePdfService, PdfService } from './pdf-service';

const pdfService: PdfService = new ChromePdfService();
const encryptionService: EncryptionService = new QpdfEncryptionService();

module.exports.pdfReport = async (event, context, callback) => {
  console.log(`pdfReport request ${JSON.stringify(event, null, 4)}`);
  const url = event.query.url;
  const buffer = await pdfService.getPdf(url);
  const encrypted = await encryptionService.encryptPdf(buffer, 'SecretOwnerPassword', 'SecretUserPassword');

  callback(null, encrypted.toString('base64'));
};

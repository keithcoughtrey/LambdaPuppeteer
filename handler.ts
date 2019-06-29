import { ChromePdfService, PdfService } from './pdf-service';

const pdfService: PdfService = new ChromePdfService();

module.exports.pdfReport = async (event, context, callback) => {
  console.log(`pdfReport request ${JSON.stringify(event, null, 4)}`);
  const url = event.query.url;
  const buffer = await pdfService.getPdf(url);
  callback(null, buffer.toString('base64'));
};

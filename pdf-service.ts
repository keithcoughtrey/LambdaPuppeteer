export interface PdfService {
    getPdf(url: string): Promise<Buffer>;
}

import chromium = require('chrome-aws-lambda');
import puppeteer = require('puppeteer-core');

export class ChromePdfService implements PdfService {
  public async getPdf(url: string): Promise<Buffer> {
    console.log(`Generating PDF for ${url}`);

    let browser = null;
    try {
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
      });

      const page = await browser.newPage();

      await page.goto(url, {
        waitUntil: ['networkidle0', 'load', 'domcontentloaded'],
      });
      const result = await page.pdf({
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        footerTemplate: `
        <div style="font-size:10px; margin-left:20px;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>
        `,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '50px',
          left: '20px',
        },
      });
      console.log(`buffer size = ${result.length}`);
      return result;
    } catch (error) {
      throw new Error(`Failed to PDF url ${url} Error: ${JSON.stringify(error)}`);
    } finally {
      if (browser !== null) {
        await browser.close();
      }
    }
  }
}
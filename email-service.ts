export interface EmailService {

  send(to: string, subject: string, body: string, base64Attachment?: string, attachmentName?: string): Promise<any>;

}

import * as nodemailer from 'nodemailer';

const emailAddress = process.env.EMAIL_ADDRESS;
const emailPassword = process.env.EMAIL_PASSWORD;
const smtpUrl = `smtps://${emailAddress}:${emailPassword}@smtp.gmail.com`;
const mailTransport = nodemailer.createTransport(smtpUrl);

export class NodeEmailService implements EmailService {

  public send(to: string, subject: string, body: string, base64Attachment?: string, attachmentName?: string): Promise<any> {
    const attachments = [];
    if (base64Attachment) {
      attachments.push({
        filename: attachmentName || 'Report.pdf',
        content: base64Attachment,
        encoding: 'base64',
      });
    }
    const mailOptions = {
        from: emailAddress,
        to: to,
        subject: subject,
        text: body,
        attachments: attachments,
    };

    console.log(`Sending email\nTo: ${to}\nSubject ${subject}\nBody ${body}`);
    return mailTransport.sendMail(mailOptions);
  }

}

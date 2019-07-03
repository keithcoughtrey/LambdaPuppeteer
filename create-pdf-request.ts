export interface CreatePdfRequest {
    url: string;
    reportName: string;
    toAddress: string;
    encryptionRequired: boolean;
    ownerPassword?: string;
    userPassword?: string;
    pdfFilePath?: string;
    encryptedFilePath?: string;
};
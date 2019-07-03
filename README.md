# Lambda-puppeteer HTML to PDF

This project contains sample code related to a series of Medium articles.

In the [first article](https://itnext.io/html-to-pdf-using-a-chrome-puppet-in-the-cloud-de6e6a0dc6d7?sk=de0cbdf69ae1cfd52ecd8ba457c2ded7) of the series, I walked through the process of setting up a headless chrome browser that you can run on AWS and using the Puppeteer API, have chrome navigate to a URL, wait for the page to fully-load and then create a PDF.

In the [second article](https://itnext.io/running-arbitrary-executables-in-aws-lambda-encrypting-a-pdf-afea47e3c345?sk=22d11f9a7e4a759c51f09368a4974b30) I showed how to encrypt the PDF using the command-line tool qpdf, which was built from source.

In the [third article](todo) I walk through a real-world example of AWS step functions use. I covered building a step functions process that calls the PDF service, decides whether to encrypt the output, then emails the PDF to a specified address.

Before deploying, set your email address and email password using the AWS cli

```
aws ssm put-parameter --name emailAddress-dev --type SecureString --region us-east-1 --value <your email address>
aws ssm put-parameter --name emailPassword-dev --type SecureString --region us-east-1 --value <your email password>
```
Deploy using 
```
npm run deploy
```

[Keith Coughtrey](https://itnext.io/@keith.coughtrey)

import nodemailer from "nodemailer";
import "dotenv/config";

export async function sendEmail(email, answer, companyName) {
  try {
    console.log(
      email,
      answer,
      companyName,
      process.env.SMTP_SERVER,
      process.env.SMTP_PORT,
      process.env.SMTP_AUTH_USER,
      process.env.SMTP_AUTH_PASSWORD
    );

    var transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      secure: true,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_AUTH_USER,
        pass: process.env.SMTP_AUTH_PASSWORD,
      },
      logger: true,
      debug: true,
    });

    var mailOptions = {
      from: `"${companyName}" <${process.env.SMTP_EMAIL_ADDRESS}>`,
      to: email,
      subject: `${companyName} just sent you a message`,
      html: `
      <html>
        <body>
            <h1>${companyName} just sent you a message</h1>
            <p>${answer}</p>
            <p>Sent using suprr.app</p>
        </body>
      </html>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(info);
  } catch (error) {
    console.log("Email sending error: ", error);
  }
}

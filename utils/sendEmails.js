import { createTransport } from "nodemailer";


export const sendEmail = async(options)=> {

  let transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL, 
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // send mail with defined transport object
  let message = {
    from: `${process.env.FROM_NAME} < ${process.env.FROM_EMAIL} >`, // sender address
    to: options.email,
    subject: options.subject ,
    text: options.text,
  }
  const info = await transporter.sendMail(message);
  console.log("Message sent: %s", info.messageId);

}

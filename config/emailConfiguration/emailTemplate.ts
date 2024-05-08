import emailOPT from "./emailConfigurations";



export default function sendEmail(email: string, subject: string, message: string) {
    emailOPT.emailOptions.to = email;
    emailOPT.emailOptions.subject = subject;
    emailOPT.emailOptions.text = message;
    emailOPT.transporter.sendMail(
      emailOPT.emailOptions,
      function (error, info) {
        if (error) {
          throw new Error(error.message);
        }
      }
    );
  }
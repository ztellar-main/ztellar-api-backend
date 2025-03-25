import nodemailer from 'nodemailer';
import { template } from '../email-templates/movieSubscriptionExpiredTemplate'; 

export const movieSubscriptionExpiredEmail = async (
  username: string,
  movieName: string,
  email: string
) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'Zstellar01@gmail.com',
      pass: 'tibu ezep snnq cynr',
    },
  });

  async function main() {
    const info = await transporter.sendMail({
      from: '<Zstellar01@gmail.com>', // sender address
      to: `${email}`, // list of receivers
      subject: 'Ztellar', // Subject line
      html: `${template(username, movieName)}`, // html body
    });
    return true;
  }

  const mail = await main().catch(console.error);
};

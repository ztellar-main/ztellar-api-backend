import nodemailer from 'nodemailer';
import { template } from '../email-templates/contestCreateTeam';

export const contestCreateTeam = async (
  email: string,
  teamName: string,
  eventName: string,
  teamMates: any
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
      html: `${template(teamName, eventName, teamMates)}`, // html body
    });
    return true;
  }

  const mail = await main().catch(console.error);
};

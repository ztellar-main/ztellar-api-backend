import nodemailer from 'nodemailer';
import { template } from '../email-templates/contestTeamMatesAddedEmail';

export const contestTeamMateAdded = async (
  email: string,
  teamName: string,
  eventName: string,
  role: string
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
      html: `${template(teamName, eventName, role)}`, // html body
    });
    return true;
  }

  const mail = await main().catch(console.error);
};

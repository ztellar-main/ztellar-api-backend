import AppError from './AppError';
import { Response } from 'express';

import nodemailer from 'nodemailer';

export const sponsorReservationEmailEvent = async (
  companyName: string,
  companyAddress: string,
  companyTinNumber: string,
  companyContact: string,
  companyContactPerson: string,
  mainLineOfBusiness: string,
  learnUs: string,
  bootName: string,
  bootType: string,
  bootPrice: string,
  productTitle: string
) => {
  function formatToPeso(number: number) {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(number);
  }
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
    await transporter.sendMail({
      from: '<Zstellar01@gmail.com>', // sender address
      // to: `${email}`, // list of receivers
      to: `denverbigayan1@gmail.com`, // list of receivers
      subject: `Sponsor Reservation for - ${productTitle}`, // Subject line
      // text: `${otp}`, // plain text body
      html: `
      Booth Name: ${bootName} <br>
      Booth Type: ${bootType} <br>
      Booth Price: ${formatToPeso(Number(bootPrice))} <br>
      Company Name: ${companyName} <br>
      Company Address: ${companyAddress} <br>
      Company TIN Number: ${companyTinNumber} <br>
      Company Contact: ${companyContact} <br>
      Company Contact Person: ${companyContactPerson} <br>
      Company Main Line of Work: ${mainLineOfBusiness} <br>
      Where did they learn from us: ${learnUs}
      `, // html body
    });
    return true;
  }

  await main().catch(console.error);
};

import AppError from "./AppError";
import { Response } from "express";

import nodemailer from "nodemailer";

export const sendEmail = async (
  email: string,
  senderEmail: string,
  eventTitle: string,
  bootNumber: any,
  sponsorType: string,
  sponsorPrice: string
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "Zstellar01@gmail.com",
      pass: "tibu ezep snnq cynr",
    },
  });

  async function main() {
    const info = await transporter.sendMail({
      from: "<Zstellar01@gmail.com>", // sender address
      to: `${email}`, // list of receivers
      subject: "Ztellar - verify your email", // Subject line
      // text: `${otp}`, // plain text body
      html: `Email: ${senderEmail}<br>Event Title: ${eventTitle} <br> Boot Number: ${bootNumber} <br> Sponsor Type: ${sponsorType} <br> Sponsor Price: ${sponsorPrice}`, // html body
    });
    return true;
  }

  const mail = await main().catch(console.error);
};

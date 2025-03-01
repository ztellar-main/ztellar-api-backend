import AppError from './AppError';
import { Response } from 'express';
import bcrypt from 'bcryptjs';
import Otp from '../models/otpModel';
import nodemailer from 'nodemailer';
import { template } from './reminderTemplate';

export const sendReminder = async (
  email: string,
  name: string,
  courseTitle: string
) => {
  const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  const hashedOTP = await bcrypt.hash(otp, 10);

  const otpUser = await Otp.findOne({ email });

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
      subject: 'Ztellar - verify your email', // Subject line
      // text: `${otp}`, // plain text body
      html: `${template({ name, courseTitle })}`, // html body
    });
    return true;
  }

  const mail = await main().catch(console.error);

  if (mail) {
    try {
      if (!otpUser) {
        const NewOtpVerification = await Otp.create({
          email: email,
          otp: hashedOTP,
          createdAt: Date.now(),
          expiredAt: Date.now() + 360000,
        });
        return true;
      } else {
        const updateOtpVerification = await Otp.findByIdAndUpdate(
          { _id: otpUser._id },
          {
            email: email,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiredAt: Date.now() + 360000,
          }
        );
        return true;
      }
    } catch (err) {
      console.log('Something went wrong saving your otp.');
    }
  }
};

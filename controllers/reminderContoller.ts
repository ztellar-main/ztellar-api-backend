import { Request, Response } from 'express';
import { tryCatch } from '../utils/tryCatch';
import CourseReminders from '../models/courseReminder';
import User from '../models/userModel';

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

// GET SINLE AUTHOR EVENT
export const createReminder = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;
    const { days, time, expiry, courseTitle, courseId } = req.body;

    const user = await User.findOne({ _id: userId });

    const email = user?.email;
    const name = `${user.fname} ${user.lname}`;

    const [hours, minutes] = time.split(':').map(Number);

    const now1 = new Date();
    const localDate = new Date(
      now1.getFullYear(),
      now1.getMonth(),
      now1.getDate(),
      hours,
      minutes
    );
    // Convert to UTC
    const utcHours = localDate.getUTCHours();
    const utcMinutes = localDate.getUTCMinutes();

    console.log({ utcHours, utcMinutes });

    const months = expiry.split(' ')[0];

    const now = new Date();
    const currentDay = now.getDate();
    now.setMonth(now.getMonth() + Number(months)); // input from user

    // get the hours
    if (now.getDate() !== currentDay) {
      now.setDate(0); // Moves to the last day of the previous month
    }

    const newReminder = await CourseReminders.create({
      hours: utcHours,
      minutes: utcMinutes,
      days,
      exp: now,
      email,
      name,
      course_title: courseTitle,
      course_id: courseId,
      user_id: userId,
    });

    res.json(newReminder);
  }
);

// GET SINLE AUTHOR EVENT
export const updateReminder = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;
    const { days, time, expiry, courseTitle, courseId, reminderId } = req.body;

    const user = await User.findOne({ _id: userId });

    const email = user?.email;
    const name = `${user.fname} ${user.lname}`;

    const hours = time.split(':')[0];
    const minutes = time.split(':')[1];

    const months = expiry.split(' ')[0];

    const now = new Date();
    const currentDay = now.getDate();
    now.setMonth(now.getMonth() + Number(months)); // input from user

    // get the hours
    if (now.getDate() !== currentDay) {
      now.setDate(0); // Moves to the last day of the previous month
    }

    const updateReminder = await CourseReminders.findOneAndUpdate(
      {
        _id: reminderId,
      },
      {
        $set: {
          hours,
          minutes,
          days,
          exp: now,
          email,
          name,
          course_title: courseTitle,
          course_id: courseId,
          user_id: userId,
        },
      }
    );

    res.status(200).json(updateReminder);
  }
);

// DELETE REMINDER
export const deleteReminder = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { reminderId } = req.body;

    const deleteReminder = await CourseReminders.findOneAndDelete({
      _id: reminderId,
    });

    res.json(deleteReminder);
  }
);

import { Response, Request } from 'express';
import AppError from '../utils/AppError';
import { tryCatch } from '../utils/tryCatch';
import EventContestModel from '../models/eventContestModel';

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

export const createTeamForEventContest = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const data = req.body;

    // const a = data.team_mates.map((data) => {
    //   return a.email;
    // });

    console.log(data.team_mates);

    // const newTeam = await EventContestModel.create(data);

    // res.json(newTeam);
  }
);

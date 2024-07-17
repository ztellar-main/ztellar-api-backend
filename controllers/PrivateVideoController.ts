import { Response, Request } from "express";

import { tryCatch } from "../utils/tryCatch";
import axios from "axios";

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

// GET VIDEO CIPHER CREDENTIALS TO UPLOAD
export const getVideoCipherCredentialsToUpload = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { title } = req.body;
    try {
      const a = await axios({
        method: "put",
        url: `https://dev.vdocipher.com/api/videos?title=${title}`,
        headers: {
          Authorization:
            "Apisecret c4UUn5f08MxQG2oQzXLaoBwjDqy2GWQrgj3ltLZrWPnIxGpUrQ6qlvhwUhucVOWR",
        },
      });

      res.json(a.data);
    } catch (err) {
      res.json(err);
    }
  }
);

// GET VIDEO CIPHER CREDENTIALS TO UPLOAD
export const getVideoCipherVideo = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const videoId = req.body.videoId;

    try {
      const result = await axios({
        method: "POST",
        url: `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Apisecret c4UUn5f08MxQG2oQzXLaoBwjDqy2GWQrgj3ltLZrWPnIxGpUrQ6qlvhwUhucVOWR`,
        },
        params: {
          ttl: 300,
        },
        data: {
          annotate: JSON.stringify([
            {
              type: "rtext",
              text: "Ztellar - Copyright protected",
              alpha: "0.30",
              color: "#334155",
              size: "20",
              interval: "5000",
            },
          ]),
        },
      });

      res.json(result.data);
    } catch (err) {
      res.status(404).json(err);
    }
  }
);

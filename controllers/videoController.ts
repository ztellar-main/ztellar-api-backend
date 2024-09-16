import { Response, Request } from 'express';
import { tryCatch } from '../utils/tryCatch';
import Product from '../models/productModel';
import AppError from '../utils/AppError';
import { ERROR_HANDLER } from '../constants/errorCodes';
import mongoose from 'mongoose';
import CourseSubject from '../models/courseSubjectModel';
import Video from '../models/videoModel';
import admin from 'firebase-admin';

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

const a: any = {
  type: 'service_account',
  project_id: 'ztellar-11a4f',
  private_key_id: '86eda7a2e20f0481b4fb966ca1055c8f65f49a1d',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDxHcZmhJRcD53C\nbJewb+LndIE3ljemCsBhdQGWLafDyPS1IT+fhU3yidLc+mdVuGb3z0dyDaNS4+8E\nhVWWQWDKWTc0AEudN/zPwv2EjSxIrz0kIdWJ3HQhfYRej6zIo96Ex5SklJH8NJ+A\n7WNsQ3wODiKGKfOzLWodkU15wvuI0/aDl6CQU9RCICGAqSvuE8sLNoXPdTW9ptk9\nuHzPlj2XySV4jLBGi9U3l5W2cUOArf/ZmkUYPjaZgbPau1dN46ddlIPqB9j/Slb/\nTjXPo1nfyQoHMO7jTK1hLW/8of7fNQFTuRAWBAbXv+EARFozg9PV0XsSzYF/c1j5\nFNE2BqBhAgMBAAECggEAc+yh1+ZEQiLL8Y8uOwkAKdHM0oHpjW474l9T/PVEZJA4\nfuFWaoa33DVBaTcG+aKn9tr0ebRu4sptv1mvtYcHVyIftWOy9wrVBLq2EsWhFe0S\n001lElwohXWIb8JaCzkmIeam453+tihCy8TWeVXUzhkjpieDYJEkJMUYX8NMFhML\n2fSytOKIRzZp2ZBTqwEXS/CeTR+reOK37f9hz22+UxnEnpjCvmATlmd+dnQ4hoJG\nNumBvgIOEbmjvuXvpAcoKO/SPQ3t/1NywQ0oqx/NlQDmV6fagHHTbopRvfDOGqXm\nCqq5cRlHAY2xXKR41hTXKhAJkdXQVMS+4APoMfroJQKBgQD5tpbuc0Tq3EF32uAO\nXYJG5NIelUvzHQlmq1L3ZflJIGQtJfXYmuReFMSiuX/Ikgr+zAepskCiUzqgtyR0\nMgGAfQvwPtVar4I+LlPa1MlYkdUitBqK1DxZ4v/QbGlFQXJU8oA6mxRJCOiqlcfg\niZE1WBtMPowTRPCCnL2EqwlhowKBgQD3L8cktQczOH78dFAnU++fKgp2FMejOaIl\nJWjpIt3+sEADYJfSodMk1Exp+WMi4yypmxL2l/Nj5u3QOmG08/f0+YJFSodUqZzG\njNAPiC8z4+XJy4afqLC7fE/CxgbbA1fUFJV+q21AGLAsm1VDATek7TRrNnBjyJxe\nMNXQhVd+KwKBgFtgs46CY9/FxbdEQuU+1qN2rGVAoNBP+da2LuAVUsmtrrrOv04K\nMDM1Sld5pgcRWjCvHMa+UeSUrEmPeymB+wa3u5yogY5z1ydF8K2NXDiq9OGEIopW\n69bAuHfelA8hyeLH8qB/i0bGmc2Cjefer2Jj4WlfIgcTHSfOj5NyuzYdAoGASS+w\nOsIOm6/CiWS2xq4naGy+JDAK290YkP7+jOhx6hKtIVLcINUg+uqQpV/dZlr0wlLT\nzoc23QFmsBxZCYaih7nIRFPItdxyOqc+gxrDPw3e31yPQ35itWAdDYIsTXQz8OsX\nSCXhdvTYVJy5JdmabA5/Uq8Pn7up8IltBQw113kCgYAo3uEuicsAe3sMP6NgiF+u\nR9vedDWyIqpCF5A7ITgylHjMYLasYdnhHYLWKS5Yz3hJi6Mh6pOUAmaXbP1tWX3S\nPHfUbVJXEeQsu0kkr0QDMcyoBdD2xgNXw1Hauj+g2KDizxit/depsgG+XGZm036N\n5t5bTgFDAII5+pnAdrUQsA==\n-----END PRIVATE KEY-----\n',
  client_email: 'firebase-adminsdk-zlxne@ztellar-11a4f.iam.gserviceaccount.com',
  client_id: '113970458885196097368',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-zlxne%40ztellar-11a4f.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};

// firebase connection
admin.initializeApp({
  credential: admin.credential.cert(a),
  storageBucket: 'ztellar-11a4f.appspot.com',
});
const bucket = admin.storage().bucket();

// get video data
export const getVideo = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { id } = req.query;

    const video = await Video.findOne({ _id: id });

    if (!video) {
      throw new AppError(
        ERROR_HANDLER,
        'Something went wrong please try again',
        400
      );
    }

    res.status(200).json(video);
  }
);

// course subject video
export const courseSubjectVideo = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { filename, courseId, subjectId, videoId } = req.params;

    const file = bucket.file(
      `course/${courseId}/${subjectId}/${videoId}/${filename}.m3u8`
    );

    const [exists] = await file.exists();

    if (!exists) {
      throw new AppError(
        ERROR_HANDLER,
        'Something went wrong please try again',
        400
      );
    }

    const stream = file.createReadStream();

    res.setHeader('Content-Type', 'application/x-mpegurl'); // Set the appropriate content type
    stream.pipe(res);
  }
);

// get subject video segments
export const getCourseSubjectVideoSegment = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { segment, courseId, subjectId, videoId } = req.params;

    const file = bucket.file(
      `course/${courseId}/${subjectId}/${videoId}/${segment}.m4s`
    );

    const [exists] = await file.exists();
    if (!exists) {
      throw new AppError(
        ERROR_HANDLER,
        'Something went wrong please try again',
        400
      );
    }

    const stream = file.createReadStream();
    res.setHeader('Content-Type', 'application/octet-stream');
    stream.pipe(res);
  }
);

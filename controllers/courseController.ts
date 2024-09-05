import { Response, Request } from 'express';
import { tryCatch } from '../utils/tryCatch';
import Product from '../models/productModel';
import AppError from '../utils/AppError';
import { ERROR_HANDLER } from '../constants/errorCodes';
import mongoose from 'mongoose';
import CourseSubject from '../models/courseSubjectModel';

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

// check if course title exist
export const ifTitleExist = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { title } = req.body;

    const course = await Product.findOne({ title });

    if (course) {
      throw new AppError(ERROR_HANDLER, 'This title already exists', 400);
    }

    res.status(200).json('success');
  }
);

// check if live id exist
export const ifLiveIdExist = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { liveId } = req.body;

    const course = await Product.findOne({ live_id: liveId });

    if (course) {
      throw new AppError(ERROR_HANDLER, 'This live id already axists', 400);
    }

    res.status(200).json('success');
  }
);

// create course
export const createCourse = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const {
      title,
      description,
      price,
      liveId,
      videoUrl,
      imageUrl,
      authorId,
      imagePath,
    } = req.body;

    if (
      !title ||
      !description ||
      !price ||
      !liveId ||
      !imageUrl ||
      !authorId ||
      !imagePath
    ) {
      throw new AppError(
        ERROR_HANDLER,
        'There is something wrong in your information',
        400
      );
    }

    const newCourse = await Product.create({
      title,
      description,
      course_price: price,
      liveId,
      video_url: videoUrl,
      image_url: imageUrl,
      type: 'course',
      author_id: authorId,
      image_path: imagePath,
    });

    res.json(newCourse);
  }
);

// update course intro video after converting video
export const updateCourseIntroVideoAfterConvertingVideo = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { videoPath, courseId } = req.body;

    const updatedCourse = await Product.findOneAndUpdate(
      { _id: courseId },
      {
        $set: { converted_video_intro: `${videoPath}.m3u8` },
      },
      { new: true }
    );

    res.json(updatedCourse);
  }
);

// get all courses - admin
export const getCourseAdmin = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const courses = await Product.find({ type: 'course' }).select(
      '-registered -prices -attendance -subjects -quiz -certificate -questions -sponsors_logo -sponsors_post -sponsors_videos -sponsors_boot'
    );
    res.status(200).json(courses);
  }
);

// get all courses - admin
export const getSingleCourseAdmin = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { id } = req.query;

    const authorIdCheck = mongoose.Types.ObjectId.isValid(id.toString());

    if (!authorIdCheck) {
      throw new AppError(ERROR_HANDLER, 'Something went wrong', 400);
    }

    const courses = await Product.findOne({ _id: id, type: 'course' })
      .select(
        '-registered -prices -attendance -subjects -quiz -certificate -questions -sponsors_logo -sponsors_post -sponsors_videos -sponsors_boot'
      )
      .populate({ path: 'course_subjects._id' });
    res.status(200).json(courses);
  }
);

// update course
export const updateCourseAdmin = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { title, description, price, liveId, authorId, courseID } = req.body;

    if (!title || !description || !price || !liveId || !authorId || !courseID) {
      throw new AppError(ERROR_HANDLER, 'Please fill up all fields', 400);
    }

    const authorIdCheck = mongoose.Types.ObjectId.isValid(authorId.toString());

    if (!authorIdCheck) {
      throw new AppError(ERROR_HANDLER, 'Invalid author id', 400);
    }

    const course = await Product.findById(courseID);

    if (course?.title !== title) {
      const courseTitle = await Product.findOne({ title: title });
      if (courseTitle) {
        throw new AppError(ERROR_HANDLER, 'This title is already exists', 400);
      }
    }

    if (course) {
      course.title = title || course.title;
      course.description = description || course.description;
      course.author_id = authorId || course.author_id;
      course.course_price = price || course.course_price;
      course.liveId = liveId || course.liveId;

      const updatedCourse = await course.save();
      res.status(200).json(updatedCourse);
    }
  }
);

// update course image
export const updateCourseImageAdmin = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { courseId, imageUrl, imagePath } = req.body;

    const course = await Product.findOne({ _id: courseId });

    if (course) {
      course.image_url = imageUrl || course.image_url;
      course.image_path = imagePath || course.image_path;

      await course.save();

      res.status(200).json('success');
    }
  }
);

// check if subject title already exist on course
export const addSubjectOnCourse = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { title, courseId } = req.body;

    const subject = await CourseSubject.findOne({
      title,
      course_id: courseId,
    });

    if (subject) {
      throw new AppError(
        ERROR_HANDLER,
        'This subject title is already exists on this course',
        400
      );
    }

    const newSubject = await CourseSubject.create({
      title,
      course_id: courseId,
    });

    const updatedCourse = await Product.findOneAndUpdate(
      { _id: courseId },
      { $push: { course_subjects: { _id: newSubject?._id } } },
      {
        new: true,
      }
    );

    res.json(updatedCourse);
  }
);

import { Response, Request } from 'express';
import { tryCatch } from '../utils/tryCatch';
import Product from '../models/productModel';
import AppError from '../utils/AppError';
import { ERROR_HANDLER } from '../constants/errorCodes';
import mongoose from 'mongoose';
import CourseSubject from '../models/courseSubjectModel';
import Video from '../models/videoModel';

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
      .populate({ path: 'course_subjects.data' })
      .populate({ path: 'course_subjects.videos.data' });
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
      { $push: { course_subjects: { data: newSubject?._id } } },
      {
        new: true,
      }
    );

    res.json(updatedCourse);
  }
);

// check if video title already exists
export const checkIfVideoTitleAlreadyExist = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { title, subjectId, courseId } = req.body;

    const video = await Video.findOne({
      title,
      subject_id: subjectId,
      product_id: courseId,
    });

    if (video) {
      throw new AppError(
        ERROR_HANDLER,
        'This video title is already exists on this subject',
        400
      );
    }

    res.status(200).json('success');
  }
);

// add video to subject
export const addVideoToSubject = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { title, courseId, subjectId } = req.body;

    const newVideo = await Video.create({
      title,
      product_id: courseId,
      subject_id: subjectId,
    });

    const videoUrlConverted = `course/${courseId}/${subjectId}/${newVideo._id}/adaptive.m3u8`;

    await Video.findOneAndUpdate(
      { _id: newVideo._id },
      {
        $set: { video_url_converted: videoUrlConverted },
      }
    );

    await Product.findOneAndUpdate(
      { _id: courseId },
      { $push: { 'course_subjects.$[e1].videos': { data: newVideo?._id } } },
      {
        arrayFilters: [{ 'e1.data': subjectId }],
      }
    );

    res.status(201).json('success');
  }
);

// edit subject order
export const editSubjectOrder = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { data, courseId } = req.body;

    const updatedCourse = await Product.findOneAndUpdate(
      { _id: courseId },
      { $set: { course_subjects: data } },
      { new: true }
    );

    res.status(200).json(updatedCourse);
  }
);

// check if subjectTitle already exist
export const checkIfTitleAlreadyExist = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { courseId, title } = req.body;

    const subject = await CourseSubject.findOne({ course_id: courseId, title });

    if (subject) {
      throw new AppError(
        ERROR_HANDLER,
        'This subject title already exist in this course',
        400
      );
    }

    res.json('success');
  }
);

// update subject title
export const updateCourseSubjectTitle = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { title, subjectId } = req.body;

    await CourseSubject.findOneAndUpdate(
      { _id: subjectId },
      {
        $set: { title: title },
      },
      { new: true }
    );

    res.status(200).json('success');
  }
);

// check video title if already exists
export const checkVideoTitleIfexists = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { subjectId, title } = req.body;

    const video = await Video.findOne({ subject_id: subjectId, title });

    if (video) {
      throw new AppError(
        ERROR_HANDLER,
        'This video title already exist in this subject',
        400
      );
    }

    res.status(200).json('success');
  }
);

// edit subject video title
export const editSubjectVideoTitle = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { videoId, title } = req.body;

    await Video.findOneAndUpdate(
      { _id: videoId },
      {
        $set: { title: title },
      }
    );

    res.status(200).json('success');
  }
);

// get subject videos
export const getSubjectVideos = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { courseId, subjectId } = req.query;
    if (!courseId || !subjectId) {
      throw new AppError(
        ERROR_HANDLER,
        'Something went wrong please try again',
        400
      );
    }

    const course = await Product.findOne({
      _id: courseId,
    }).populate({ path: 'course_subjects.videos.data' });

    const videos = course.course_subjects.filter((data: any) => {
      const asd = data._id.toString();
      return asd === subjectId;
    });

    res.status(200).json(videos[0]);
  }
);

// udpate subject videos order
export const updateSubjectVideosOrder = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { courseId, subjectId, data } = req.body;

    if (!courseId || !subjectId || !data) {
      throw new AppError(
        ERROR_HANDLER,
        'Something went wrong please try again',
        400
      );
    }

    await Product.findOneAndUpdate(
      { _id: courseId },
      {
        $set: { 'course_subjects.$[e1].videos': data },
      },
      { arrayFilters: [{ 'e1._id': subjectId }] }
    );

    res.status(200).json('success');
  }
);

// activate or deactivate video
export const activateOrDeactivateVideo = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { videoId, videoState } = req.body;
    const newVideoState = !videoState;

    const updatedVideo = await Video.findByIdAndUpdate(
      { _id: videoId },
      { $set: { status: newVideoState } },
      { new: true } // This returns the updated document
    );

    res.status(200).json('success');
  }
);

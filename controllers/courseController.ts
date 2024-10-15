import { Response, Request } from 'express';
import { tryCatch } from '../utils/tryCatch';
import Product from '../models/productModel';
import AppError from '../utils/AppError';
import { ERROR_HANDLER } from '../constants/errorCodes';
import mongoose from 'mongoose';
import CourseSubject from '../models/courseSubjectModel';
import Video from '../models/videoModel';
import User from '../models/userModel';
import Question from '../models/questionModel';
import Answer from '../models/answerModel';

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

// get course single public
export const getCoursePublic = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { id, uid } = req.query;

    const course = await Product.findOne({ _id: id })
      .select(
        'converted_video_intro title description course_price average_rating feedback feedback_count course_subjects author_id registered'
      )
      .populate({ path: 'course_subjects.data', select: 'title' })
      .populate({ path: 'course_subjects.videos.data', select: 'title' })
      .populate({ path: 'author_id', select: 'avatar fname lname' });

    if (!course) {
      throw new AppError(
        ERROR_HANDLER,
        'Something went wrong please try again',
        400
      );
    }

    // if user is already registered
    const registeredFilter = course.registered.filter((data) => {
      let stringId: any = data._id.toString();
      return (stringId = uid);
    });

    const registeredFilterLength = registeredFilter.length;

    let registered = false;

    if (registeredFilterLength > 0) {
      registered = true;
    }

    res.status(200).json({ data: course, registered });
  }
);

// get acquired course
export const getAcquiredCourse = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;
    const { id } = req.query;

    const courseId = await Product.findOne({ _id: id })
      .select(
        'course_subjects title description author_id average_rating feedback createdAt'
      )
      .populate({ path: 'course_subjects.data', select: 'title' })
      .populate({
        path: 'course_subjects.videos.data',
        select: 'title video_url_converted',
      })
      .populate({ path: 'course_subjects.questions', select: '-answer' });

    if (!courseId) {
      throw new AppError(
        ERROR_HANDLER,
        'Something went wrong please try again',
        400
      );
    }

    const user = await User.findOne({ _id: userId });

    const userFilter = user.product_owned.filter((data) => {
      return (data._id = courseId._id);
    });

    const userFilterLength = userFilter.length;

    if (userFilterLength === 0) {
      throw new AppError(
        ERROR_HANDLER,
        'Something went wrong please try again',
        400
      );
    }

    res.status(200).json(courseId);
  }
);

// setup subject questionnaire
export const setupSubjectQuestionnaire = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { courseId, subjectId, questions } = req.body;
    // console.log({ courseId, subjectId, questions });

    const newQuestion = await Question.create({ questions });

    const updatedCourse = await Product.findOneAndUpdate(
      { _id: courseId },
      {
        $set: { 'course_subjects.$[e1].questions': newQuestion._id },
      },
      { arrayFilters: [{ 'e1._id': subjectId }] }
    );

    res.status(201).json({ updatedCourse });
  }
);

// get subject question
export const getSubjectQuestions = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { subjectId, courseId } = req.query;

    const product = await Product.findOne({ _id: courseId })
      .populate({
        path: 'course_subjects',
      })
      .populate({ path: 'course_subjects.questions' });

    console.log(product);

    const subjectQuestionFilter = product.course_subjects.filter(
      (data: any) => {
        const dataId = data._id.toString();
        return dataId === subjectId;
      }
    );
    res.status(200).json(subjectQuestionFilter[0].questions);
  }
);

// update subject question
export const updateSubjectQuestion = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { id, questions } = req.body;

    console.log(questions);

    const udpatedQuestion = await Question.findOneAndUpdate(
      { _id: id },
      {
        $set: { questions: questions },
      },
      { new: true }
    );

    res.json(udpatedQuestion);
  }
);

// get course subject answer
export const getCourseSubjectAnswer = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;
    const { courseId, subjectId } = req.query;

    console.log(subjectId);

    // console.log({ courseId, subjectId, userId });

    if (
      !courseId ||
      !subjectId ||
      !userId ||
      subjectId === '' ||
      subjectId === 'undefined'
    ) {
      return res.status(200).json('no');
    } else {
      const answer = await Answer.findOne({
        course_id: courseId,
        subject_id: subjectId,
        user_id: userId,
        status: false,
      });

      return res.json(answer);
    }
  }
);

// create answer
export const createAnswer = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;
    const { courseId, subjectId, questionTimeInMunites } = req.body;

    console.log(subjectId);

    const expired_time = Date.now() + 1000 * 60 * questionTimeInMunites;

    const newAnswer = await Answer.create({
      course_id: courseId,
      subject_id: subjectId,
      user_id: userId,
      time_expired: expired_time,
    });

    res.status(201).json(newAnswer);
  }
);

// save answer
export const saveAnswer = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { answer, questionId, answerId, questionTimeInMunites } = req.body;

    const answerFind = await Answer.findOne({ _id: answerId });

    const asd = answerFind.answers.length;

    const questionFind = await Question.findOne({ _id: questionId });

    let ans = false;
    let status = false;
    let currentScore = answerFind.score;
    let currentPassed = false;
    const expired_time = Date.now() + 1000 * 60 * questionTimeInMunites;

    // if answer is correct
    if (questionFind.questions[asd].answer === answer) {
      currentScore = currentScore + 1;
      ans = true;
    }

    // if quiz passed
    if (currentScore >= answerFind?.passing_score) {
      currentPassed = true;
    }

    const answerLength = answerFind.answers.length + 1;
    const questionLength = questionFind.questions.length;

    // if finished
    if (answerLength === questionLength) {
      status = true;
    }

    const correctAnswer = questionFind.questions[asd].answer;

    const answerData = {
      correct: ans,
      answer: answer,
      correct_answer: correctAnswer,
      question: questionFind.questions[asd].question,
      choices: questionFind.questions[asd].choices,
    };

    const updateAnswer = await Answer.findOneAndUpdate(
      { _id: answerId },
      {
        $set: {
          status: status,
          score: currentScore,
          passed: currentPassed,
          time_expired: expired_time,
        },
        $push: { answers: answerData },
      },
      { new: true }
    );

    res.json(updateAnswer);
  }
);

// GET FINISHED ANSWER
export const getFineshedAnswer = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { productId, subjectId } = req.query;
    const userId = req.user;

    if (
      !productId ||
      !subjectId ||
      subjectId === undefined ||
      subjectId === 'undefined'
    ) {
      return res.status(200).json('no-subejct');
    }

    const answer = await Answer.find({
      course_id: productId,
      subject_id: subjectId,
      user_id: userId,
      status: true,
    }).select('answers score _id passed passing_score');

    // console.log(answer);
    res.status(200).json(answer);
  }
);

// get sigle finished answer
export const getSingleFineshedAnswer = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;
    const { id } = req.query;

    const answer = await Answer.findOne({
      _id: id,
      user_id: userId,
      status: true,
    })
      .populate({
        path: 'course_id',
        select: 'title',
      })
      .populate({ path: 'subject_id', select: 'title' });

    // console.log(answer);
    res.status(200).json(answer);
  }
);

// save recent clicked subject
export const saveRecentClickedSubject = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;
    const { currentVideo, courseId } = req.body;

    let subject_id = currentVideo.subjectId;

    if (subject_id === undefined) {
      subject_id = '';
    }

    // update data
    const data = {
      course_id: courseId,
      recent: {
        subjectIndex: currentVideo.subjectIndex,
        videoIndex: currentVideo.videoIndex,
        stateType: currentVideo.type,
        subjectId: subject_id,
      },
    };

    const recentUserData = await User.findOne({ _id: userId });
    const courseIdSchema = new mongoose.Types.ObjectId(courseId);

    const a = recentUserData.recent_course_clicked.find((data: any) => {
      const asd = data.course_id === courseIdSchema;
      const courseIdString = data.course_id.toString();
      return courseIdString === courseId;
    });

    if (!a) {
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $push: {
            recent_course_clicked: data,
          },
        },
        { new: true }
      );

      return res.status(201).json('success');
    }

    const updateRecent = await User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $set: { 'recent_course_clicked.$[e1]': data },
      },
      {
        arrayFilters: [{ 'e1._id': a._id }],
        new: true,
      }
    );

    res.status(201).json('2');
  }
);

// get recent state
export const getRecentState = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;
    const { courseId } = req.query;

    const recent = await User.findOne({ _id: userId });

    const recentFiltered = recent.recent_course_clicked.find((data: any) => {
      const courseIdString = data.course_id.toString();
      return courseIdString === courseId;
    });

    res.json(recentFiltered);
  }
);

// if user passed all the subjects
export const ifUserPassedAllTheSubjects = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;
    const { courseId } = req.query;

    console.log(courseId);
    const checkPassedSubjects = async (courseId: any) => {
      const result = await Answer.aggregate([
        // Match documents by the provided course_id and where passed is true
        {
          $match: {
            course_id: new mongoose.Types.ObjectId(courseId),
            user_id: userId,
            passed: true,
          },
        },

        // Group by subject_id and count the number of passed answers
        {
          $group: {
            _id: '$subject_id',
            count: { $sum: 1 }, // Count the number of passed answers per subject
          },
        },

        // Populate subject_id (join with CourseSubject collection)
        {
          $lookup: {
            from: 'coursesubjects', // The collection name
            localField: '_id', // subject_id from the $group stage
            foreignField: '_id', // Match with _id of CourseSubject
            as: 'subjectDetails',
          },
        },

        // Unwind subjectDetails to ensure we get a flat structure,
        // but keep documents with no matches in subjectDetails
        {
          $unwind: {
            path: '$subjectDetails',
            // preserveNullAndEmptyArrays: true, // Keep documents even if subjectDetails is empty
          },
        },

        // Project the relevant fields to return
        {
          $project: {
            _id: 0, // Exclude the default _id from output
            subject_id: '$_id',
            subject_title: '$subjectDetails.title', // Uncomment if you want the subject title
            course_id: '$subjectDetails.course_id', // Uncomment if you want the course ID
            passed_count: '$count', // Include the count of passed answers
          },
        },
      ]);

      return result;
    };
    const pass = await checkPassedSubjects(courseId)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        return err;
      });

    const numberOfSubjectsFind = await Product.findOne({
      _id: courseId,
    })
      .select('course_subjects')
      .populate({ path: 'course_subjects.data' });

    const numberOfSubjects = numberOfSubjectsFind.course_subjects;

    res.status(200).json({ pass: pass, numberOfSubjects });
  }
);

// acquired course private route
export const acquiredCoursePrivateRoute = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;
    const { courseId } = req.query;

    const user = await User.findOne({ _id: userId });

    const ifExist = user.product_owned.find((data: any) => {
      const id = data._id.toString();

      return id === courseId;
    });

    res.status(200).json(ifExist);
  }
);

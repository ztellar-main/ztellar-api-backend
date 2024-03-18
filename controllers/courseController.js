import Course from "../models/courseModel.js";
import asyncHandler from 'express-async-handler';
import Subject from "../models/subjectModel.js";
import mongoose from 'mongoose';
import Video from "../models/VideoModel.js";
import User from '../models/userModel.js'
import protect from '../utils/protect.js'

// CREATE COURSE
export const createCourse = asyncHandler(async(req,res,next) => {
    const token = req.body.token

    const user = await protect(token)

    if(user === 'Not authorized, no token'){
      res.status(401).json(user)
      return
    }
      
    if(user === 'Not authorized, invalid token'){
      res.status(401).json(user)
      return
    }

    const userId = user._id
    const {title,desc,price,category,imageUrl,videoUrl} = req.body;

    if(!title || !desc || !price || !category || !imageUrl || !videoUrl){
        res.status(404);
        throw new Error('Please fill up all fields.');
    }

    req.body.image_url = imageUrl;
    req.body.video_url = videoUrl;
    req.body.author_id = userId;

    const newCourse = await Course.create(req.body)

    res.status(201).json(newCourse)
});

// GET ALL ACTIVE COURSES
export const getAllActiveCourses = asyncHandler(async(req,res,next) => {
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    let queryObj = JSON.parse(queryStr);

    queryObj.title = new RegExp(req.query.title, 'i')

    if(!req.query.title){
        delete queryObj.title;
    }

    const allActiveCourses = await Course.find(queryObj);

    res.status(200).json(allActiveCourses)
})

// GET SINGLE ACTIVE COURSE
export const getSingleActiveCourse = asyncHandler(async(req,res,next) => {
    const id = req.query.id;

    const course = await Course.findOne({
        _id:id
    }).select('-__v')
    .populate({path: 'author_id',select:'-password -updatedAt -createdAt -role -verify -course_owned -course_recents'})
    .populate({path: 'subjects._id',select:'title -_id'})
    .populate({path: 'subjects.videos',select:'title -_id'})
    .populate({path:'feedback',populate:{path:'user',select:'username -_id'}});

    if(Number(course.length) === 0){
        res.status(404);
        throw new Error('Course not found.')
    }

    res.status(200).json(course)
})


// CHECK COURSE TITLE
export const checkCourseTitle = asyncHandler(async(req,res,next) => {
    const token = req.body.token

    const user = await protect(token)

    if(user === 'Not authorized, no token'){
      res.status(401).json(user)
      return
    }
      
    if(user === 'Not authorized, invalid token'){
      res.status(401).json(user)
      return
    }

    const {title} = req.body;

    const findTitle = await Course.find({title});

    if(Number(findTitle.length) > 0){
        console.log('asdasd');
        res.status(404);
        throw new Error('This title is already exist');
    }

    res.status(200).json('success');
})

// GET ALL AUTHOR COURSES
export const GetAllAuthorCourses = asyncHandler(async(req,res,next) => {
    const token = req.query.token

    const user = await protect(token)

    if(user === 'Not authorized, no token'){
      res.status(401).json(user)
      return
    }
      
    if(user === 'Not authorized, invalid token'){
      res.status(401).json(user)
      return
    }

    const authorId = user._id
    let id = new mongoose.Types.ObjectId(authorId)

    const authorCourses = await Course.find({author_id:authorId});
    res.status(200).json(authorCourses);
})

// GET AUTHOR SINGLE COURSE
export const GetSingleAuthorCourse = asyncHandler(async(req,res,next) => {
    const token = req.query.token

    const user = await protect(token)

    if(user === 'Not authorized, no token'){
      res.status(401).json(user)
      return
    }
      
    if(user === 'Not authorized, invalid token'){
      res.status(401).json(user)
      return
    }

    const courseId = req.query.courseId;
    const authorId = user._id;

    const course = await Course.find({
        _id: courseId,
        author_id: authorId
    })
    .populate({path : 'subjects._id'})
    .populate({path: 'subjects.videos'})
    .populate({path:'feedback'});

    res.status(200).json(course)
})

// GET SINGLE OWNED COURSE
export const getSingleOwnedCourse = asyncHandler(async(req,res,next) => {
    const token = req.query.token

    const user = await protect(token)

    if(user === 'Not authorized, no token'){
      res.status(401).json(user)
      return
    }
      
    if(user === 'Not authorized, invalid token'){
      res.status(401).json(user)
      return
    }

    const courseId = req.query.courseId;

    const course = await Course.find({_id: courseId}).populate({path: 'subjects._id'}).populate({path: 'subjects.videos'}).populate({path:'feedback'});

    res.status(200).json(course)
})

// DELETE COURSE
export const deleteCourse = asyncHandler(async(req,res,next) => {
    const token = req.body.token

    const user = await protect(token)

    if(user === 'Not authorized, no token'){
      res.status(401).json(user)
      return
    }
      
    if(user === 'Not authorized, invalid token'){
      res.status(401).json(user)
      return
    }

    const {subjectCount,courseId} = req.body;

    if(subjectCount > 0){
        res.status(404);
        throw new Error('Please delete all the subjects inside this course first.');
    }

    const deleteCourse = await Course.findByIdAndDelete(courseId);

    res.status(200).json(deleteCourse)

    
})

// ADD SUBJECT TO COURSE
export const addSubjectToCourse = asyncHandler(async(req,res,next) => {
    const token = req.body.token

    const user = await protect(token)

    if(user === 'Not authorized, no token'){
      res.status(401).json(user)
      return
    }
      
    if(user === 'Not authorized, invalid token'){
      res.status(401).json(user)
      return
    }

    const {courseId,courseTitle} = req.body;
    req.body.author_id = user._id;
    req.body.course_id = courseId;
    req.body.course_title = courseTitle;
    
    const {title} = req.body

    const findTitle = await Subject.find({
        title,
        course_id:courseId
    });

    if(Number(findTitle.length) > 0){
        res.status(404);
        throw new Error('This title is already exist in this course. Please enter another title.');
    }

    const newSubject = await Subject.create(req.body);

    // POPULATE NEW SUBJECT TO COURSE
    const updateSubjectToCourse = await Course.updateOne(
        {_id: courseId},
        {$push : {'subjects' : {_id: newSubject._id}}}
    );

    res.status(201).json(newSubject);
});

// DELETE SUBJECT FROM COURSE
export const deleteSubjectFromCourse = asyncHandler(async(req,res,next) => {
    const token = req.body.token

    const user = await protect(token)

    if(user === 'Not authorized, no token'){
      res.status(401).json(user)
      return
    }
      
    if(user === 'Not authorized, invalid token'){
      res.status(401).json(user)
      return
    }

    const {courseId,subjectId} = req.body;

    const cid = new mongoose.Types.ObjectId(courseId)
    const sid = new mongoose.Types.ObjectId(subjectId)

    const deleteSubject = await Subject.findOneAndDelete({_id: subjectId});

    const deleteSubjectFromCourse = await Course.findOneAndUpdate(
        {_id: cid},
        {$pull : {'subjects' : {_id: sid}}},
        {new:true,upsert:true}
    )

    res.json(deleteSubjectFromCourse)
})

// ADD VIDEO TO SUBJECT
export const addVideoToSubject = asyncHandler(async(req,res,next) => {
    const token = req.body.token

    const user = await protect(token)

    if(user === 'Not authorized, no token'){
      res.status(401).json(user)
      return
    }
      
    if(user === 'Not authorized, invalid token'){
      res.status(401).json(user)
      return
    }

    const {subjectId, courseId, title, videoUrl} = req.body;
    const authorId = user._id;
    req.body.author_id = authorId;
    req.body.subject_id = subjectId;
    req.body.video_url = videoUrl;

    if(!title){
        res.status(404);
        throw new Error('Please fill up all fields.');
    }

    if(!videoUrl){
        res.status(404);
        throw new Error('Please upload your video first.');
    }

    const newVideo = await Video.create(req.body)

    const vid = new mongoose.Types.ObjectId(newVideo._id);

    const addVideoToSubject = await Course.findOneAndUpdate(
        {_id: courseId},
        {$push: {"subjects.$[e1].videos":  vid}},
        {arrayFilters:[
            {"e1._id": subjectId}
        ]},
        {new:true,upsert:true}
    )

    res.json(addVideoToSubject)
});

// CHECK VIDEO TITLE IF EXIST
export const checkVideoIfExist = asyncHandler(async(req,res,next) => {
    const token = req.body.token

    const user = await protect(token)

    if(user === 'Not authorized, no token'){
      res.status(401).json(user)
      return
    }
      
    if(user === 'Not authorized, invalid token'){
      res.status(401).json(user)
      return
    }

    const {title} = req.body;

    const video = await Video.find({title});

    if(Number(video.length) > 0){
        res.status(404);
        throw new Error('Video Title already exist. Please enter another title.')
    };

    res.json('succes')
})

// VIDEO RECENT PLAYED
export const videoRecentPlayed = asyncHandler(async(req,res,next) => {
    const token = req.body.token

    const user = await protect(token)

    if(user === 'Not authorized, no token'){
      res.status(401).json(user)
      return
    }
      
    if(user === 'Not authorized, invalid token'){
      res.status(401).json(user)
      return
    }

    // course_id / subject_id / video_id
    const userId = user._id
    const {courseId ,subjectId, videoId ,duration ,currentTime} = req.body;

    console.log({courseId ,subjectId, videoId ,duration ,currentTime})

    if(!currentTime){
        console.log('stop')
        return
    }

    console.log('RUNNING');

    const courseId_mongoose = new mongoose.Types.ObjectId(courseId);
    const subjectId_mongoose = new mongoose.Types.ObjectId(subjectId);
    const videoId_mongoose = new mongoose.Types.ObjectId(videoId);

    // COURSE COUNT
    const findCourseId = await User.find({
        _id: userId,
        course_recents: {
            $elemMatch : {
                _id: courseId_mongoose
            }
        }
    })

    // SUBJECT COUNT
    const updateSubject = await User.find({
        _id: userId,
        course_recents : {
            $elemMatch : {
                _id: courseId_mongoose,
                subjects: {
                    $elemMatch : {
                        _id: subjectId_mongoose
                    }
                }
            }
        }
    }) 

    // VIDEO COUNT
    const video = await User.find({
        _id: userId,
        course_recents : {
            $elemMatch : {
                _id: courseId_mongoose,
                subjects : {
                    $elemMatch : {
                        _id: subjectId_mongoose,
                        videos : {
                            $elemMatch : {
                                _id: videoId_mongoose
                            }
                        }
                    }
                }
            }
        }

    });

    const courseCount = Number(findCourseId.length);
    const subjectCount = Number(updateSubject.length);
    const videoCount = Number(video.length);

    // console.log(courseCount)

    // COURSE NOT EXIST START
    if(courseCount === 0){
        const updateCourse = await User.findOneAndUpdate(
            {_id: userId},
            {$push: {"course_recents": {_id: courseId} }}
        )
    // SUBJECT NOT EXIST START
    if(subjectCount === 0){
        const subject = await User.findOneAndUpdate(
            {_id: userId},
            {$push: {"course_recents.$[e1].subjects":{_id: subjectId}}},
            {arrayFilters:[
                {"e1._id": courseId}
            ]},
            {new:true,upsert:true}
        );
        
        // VIDEO NOT EXIST
        if(videoCount === 0){
            const video = await User.findOneAndUpdate(
                {_id: userId},
                {$push: {"course_recents.$[e1].subjects.$[e2].videos":{_id: videoId,current_time:currentTime}}},
                {arrayFilters:[
                    {"e1._id": courseId},
                    {"e2._id": subjectId}
                ]},
                {new:true,upsert:true}
            );
            res.status(200).json(video)



        // VIDEO EXIST
        }else{
            const video = await User.findOneAndUpdate(
                {_id: userId},
                {$set: {"course_recents.$[e1].subjects.$[e2].videos.$[e3].current_time":  currentTime}},
                {arrayFilters:[
                    {"e1._id": courseId},
                    {"e2._id": subjectId}
                ]},
                {new:true,upsert:true}
            );
            res.status(200).json(video)
        }
    // SUBJECT EXIST START
    }else{
        // VIDEO NOT EXIST
        if(Number(video.length) === 0){
            const video = await User.findOneAndUpdate(
                {_id: userId},
                {$push: {"course_recents.$[e1].subjects.$[e2].videos":{_id: videoId,current_time:currentTime}}},
                {arrayFilters:[
                    {"e1._id": courseId},
                    {"e2._id": subjectId}
                ]},
                {new:true,upsert:true}
            );
            res.status(200).json(video)
        

        
        // VIDEO EXIST
        }else{
            const video = await User.findOneAndUpdate(
                {_id: userId},
                {$set: {"course_recents.$[e1].subjects.$[e2].videos.$[e3].current_time":  currentTime}},
                {arrayFilters:[
                    {"e1._id": courseId},
                    {"e2._id": subjectId},
                    {"e3._id": videoId}
                ]},
                {new:true,upsert:true}
            );
            res.status(200).json(video)
        }

    }   
               
    // COURSE NOT EXIST END

    // COURSE EXIST START
    }else{
        // SUBJECT NOT EXIST START
        if(subjectCount === 0){
            const subject = await User.findOneAndUpdate(
                {_id: userId},
                {$push: {"course_recents.$[e1].subjects":{_id: subjectId}}},
                {arrayFilters:[
                    {"e1._id": courseId}
                ]},
                {new:true,upsert:true}
            );
            
            // VIDEO NOT EXIST
            if(videoCount === 0){
                const video = await User.findOneAndUpdate(
                    {_id: userId},
                    {$push: {"course_recents.$[e1].subjects.$[e2].videos":{_id: videoId,current_time:currentTime}}},
                    {arrayFilters:[
                        {"e1._id": courseId},
                        {"e2._id": subjectId}
                    ]},
                    {new:true,upsert:true}
                );
                res.status(200).json(video)



            // VIDEO EXIST
            }else{
                const video = await User.findOneAndUpdate(
                    {_id: userId},
                    {$set: {"course_recents.$[e1].subjects.$[e2].videos.$[e3].current_time":  currentTime}},
                    {arrayFilters:[
                        {"e1._id": courseId},
                        {"e2._id": subjectId}
                    ]},
                    {new:true,upsert:true}
                );
                res.status(200).json(video)
            }
        // SUBJECT EXIST START
        }else{
            // VIDEO NOT EXIST
            if(Number(video.length) === 0){
                const video = await User.findOneAndUpdate(
                    {_id: userId},
                    {$push: {"course_recents.$[e1].subjects.$[e2].videos":{_id: videoId,current_time:currentTime}}},
                    {arrayFilters:[
                        {"e1._id": courseId},
                        {"e2._id": subjectId}
                    ]},
                    {new:true,upsert:true}
                );
                res.status(200).json(video)
            
            // VIDEO EXIST
            }else{
                const video = await User.findOneAndUpdate(
                    {_id: userId},
                    {$set: {"course_recents.$[e1].subjects.$[e2].videos.$[e3].current_time":  currentTime}},
                    {arrayFilters:[
                        {"e1._id": courseId},
                        {"e2._id": subjectId},
                        {"e3._id": videoId}
                    ]},
                    {new:true,upsert:true}
                );
                res.status(200).json(video)
            }

        }   
    }
    // COURSE EXIST END
})

// VIDEO LAST PLAYED
export const videoLastPlayed = asyncHandler(async(req,res,next) => {
    const token = req.body.token

    const user = await protect(token)

    if(user === 'Not authorized, no token'){
      res.status(401).json(user)
      return
    }
      
    if(user === 'Not authorized, invalid token'){
      res.status(401).json(user)
      return
    }

    const userId = user._id;
    
    const {courseId ,currentTime ,subjectIndex, videoIndex} = req.body;
    // console.log({courseId ,currentTime,subjectIndex,userId});

    const resume = await User.findOneAndUpdate(
        {_id: userId},
        {$set : {"course_recents.$[e1].resume" : `${subjectIndex}/${videoIndex}/${currentTime}`}},
        {arrayFilters:[
            {"e1._id": courseId}
        ]},
        {new:true,upsert:true}
    )
    res.json(resume)
})  

// GET ALL OWNED COURSE
export const getAllOwnedCourse = asyncHandler(async(req,res,next) => {
    const token = req.query.token

    const user = await protect(token)

    if(user === 'Not authorized, no token'){
      res.status(401).json(user)
      return
    }
      
    if(user === 'Not authorized, invalid token'){
      res.status(401).json(user)
      return
    }

    const userId = user
    try{
        const courses = await User.findOne({_id:userId})
        .select('course_owned')
        .populate(
            {path:'course_owned._id',select:'-subjects'
                ,populate:[
                    {path:'feedback'},
                    {path:'author_id'}
                ]   
        })
        res.status(200).json(courses);
    }catch(err){
        throw new Error('Something went wrong please reload the page.');
    }
});











import asyncHandler from 'express-async-handler';
import Sample from '../models/Sample.js';

export const AddSampleVideo = asyncHandler(async(req,res,next) => {
    const {title,videoUrl} = req.body;

    req.body.video_url = videoUrl;

    const newVideo = await Sample.create(req.body);

    res.status(201).json(newVideo)
});

export const GetAllSampleVideos = asyncHandler(async(req,res,next) => {
    const videos = await Sample.find();

    res.status(200).json(videos)
})
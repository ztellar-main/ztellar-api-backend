import asyncHandler from 'express-async-handler';
import cloudinary from '../utils/cloudinary.js'
import fs from 'node:fs'
import protect from '../utils/protect.js';

// UPLOAD COURSE IMAGE
export const UploadCourseImage = asyncHandler(async(req,res,next) => {
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


    const fileSize = Number(req.file.size)/1048576;
    const fileType = req.file.mimetype.split('/')[0];

    if(fileType !== 'image'){
        fs.unlinkSync(`${req.file.path}`)
        res.status(404);
        throw new Error('Invalid file type. please upload only image.');
    }

    if(fileSize > 10){
        fs.unlinkSync(`${req.file.path}`)
        res.status(404);
        throw new Error('Image file size should be 10mb and below.');
    }

    const id = user.id;
    const courseTitle = req.query.title || 'THIS'
    const fileTitle = `image_file_${courseTitle}`
    const publicId = `${id}/${courseTitle}/${fileTitle}`
    cloudinary.uploader.upload_large(`${req.file.path}`,
    { 
    public_id: publicId,
    resource_type:"image",
    upload_preset:`${process.env.PRESET}`
    }, 
    function(error, result) {
        res.json(result)
        fs.unlinkSync(`${req.file.path}`)
        console.log('deleted')
    });
})

// UPLOAD COURSE VIDEO
export const UploadCourseVideo = asyncHandler(async(req,res,next) => {
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

    const fileSize = Number(req.file.size)/1048576;
    const fileType = req.file.mimetype.split('/')[0];

    if(fileType !== 'video'){
        fs.unlinkSync(`${req.file.path}`)
        res.status(404);
        throw new Error('Invalid file type. please upload only video.');
    }

    if(fileSize > 500){
        fs.unlinkSync(`${req.file.path}`)
        res.status(404);
        throw new Error('Video file size should be 10mb and below.');
    }

    const id = user.id;
    const courseTitle = req.query.title || 'THIS'
    const fileTitle = `video_file_${courseTitle}`
    const publicId = `${id}/${courseTitle}/${fileTitle}`
    cloudinary.uploader.upload_large(`${req.file.path}`,
    { 
    public_id: publicId,
    resource_type:"video",
    upload_preset:`${process.env.PRESET}`
    }, 
    function(error, result) {
        if(error){
            res.status(404);
            throw new Error('Something went wrong. Please try again.');
        }
        res.json(result);
        fs.unlinkSync(`${req.file.path}`)
        console.log('deleted')
    });
})

// UPLOAD SUBJECT'S VIDEO
export const UploadSubjectVideo = asyncHandler(async(req,res,next) => {
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

    const fileSize = Number(req.file.size)/1024/1024;
    const fileType = req.file.mimetype.split('/')[0];

    if(fileType !== 'video'){
        fs.unlinkSync(`${req.file.path}`)
        res.status(404);
        throw new Error('Invalid file type. please upload only video.');
    }

    if(fileSize > 2000){
        fs.unlinkSync(`${req.file.path}`)
        res.status(404);
        throw new Error('Video file size should be 100mb and below.');
    }

    const id = user.id;
    const courseTitle = req.query.courseTitle;
    const subjectTitle = req.query.subjectTitle;
    const title = req.query.title;
    const fileTitle = `video_file_${title}`
    const publicId = `${id}/${courseTitle}/${subjectTitle}/${fileTitle}`
    cloudinary.uploader.upload_large(`${req.file.path}`,
    { 
    public_id: publicId,
    resource_type:"video",
    upload_preset:`${process.env.PRESET}`
    }, 
    function(error, result) {
        if(error){
            res.status(404);
            throw new Error('Something went wrong. Please try again.');
        }
        res.json(result);
        fs.unlinkSync(`${req.file.path}`)
        console.log('deleted')
    });
});

// DELETE COURSE VIDEO
export const deleteCourseVideoAndImage = asyncHandler(async(req,res,next) => {
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
    const {videoUrl,imageUrl} = req.body;
    const asd = [
        {
            url:videoUrl,
            type:'video'
        },
        {
            url:imageUrl,
            type:'image'
        }
    ];
    await asd.map(data => {
        cloudinary.uploader.destroy(`${data.url}`,{
            resource_type:`${data.type}`,
            upload_preset:`${process.env.PRESET}`
        }).then(result => {
            console.log(result)
        }).catch(err => {
            console.log(err)
        })
    })

    res.status(200).json({data:'success'})

})

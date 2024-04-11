import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: {
        type:String,
        required:true,
        unique:true
    },
    fname: {
        type:String,
        default:'New User'
    },
    lname: {
        type:String,
    },
    mname:{
        type:String,
    },
    password: {
        type:String,
        required:true
    },
    profile_image:{
        type:String
    },
    role:{
        type:String,
        default:'member',
        required:true
    },
    verify:{
        type:Boolean,
        default:false
    },
    login_type:{
        type:String
    },
    username:{
        type:String,
        default:'User'
    },
    loginType:String,
    author_verify:{
        type:Boolean,
        default:true
    },
    course_recents:[
        {
            _id: {
                type: mongoose.Schema.ObjectId,
                ref:'Course'
            },
            resume:String,
            subjects:[{
                _id:{
                    type: mongoose.Schema.ObjectId,
                    ref:'Subject'
                },
                videos:[{
                    _id:{
                        type: mongoose.Schema.ObjectId,
                        ref:'Video'
                    },
                    current_time:Number,
                    duration:Number
                }]
            }]
        }
    ],
    course_owned:[
        {
            _id:{
                type: mongoose.Schema.ObjectId,
                ref:'Course'
            },
            qr_code:String,
            reg_type:String
        }
    ],
},{ timestamps: true });

// HASH PASSWORD
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model('User',userSchema)

export default User


import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async(token) => {

    // console.log(token)
    // if(token === 'undefined' || token === 'null'){
    //     token = undefined
    // }

    // const a = undefined;

    // console.log(a)

    if(token){
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id).select('-password');
            return user
        }catch(err){
            return 'Not authorized, invalid token'
        }
    }else{
        return 'Not authorized, no token'
    }
}

export default protect

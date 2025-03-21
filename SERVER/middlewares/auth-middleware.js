import AppError from "../utils/error-util.js"
import JWT from "jsonwebtoken";

const isLoggedIn = async (req,res,next)=>{

    const {token} = req.cookies;

    if(!token){
        return next(AppError("Login first to access this resource", 401));
    }
    
    const userDetails = await JWT.verify(token, process.env.JWT_SECRET);

    req.user = userDetails;

    next();
}

export default isLoggedIn;

const jwt = require('jsonwebtoken');
const { findById } = require('../models/User');
const user = require('../models/User');
const ErrorResponse = require('../utils/ErrorResponse');

exports.authorized = async(req,res,next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token){
        return next(new ErrorResponse("Invalid Token - Unauthorized Access",401));
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await findById(decoded.id);

        if(!user){
            return next(new ErrorResponse('No user found',404));
        }

        req.user = user;

        next();

    }catch(error){

        return next(error);
    }

}


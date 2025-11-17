var jwt=require("jsonwebtoken")
var HttpError=require("../models/ErrorModel")



var authMiddleware=async(req,res,next)=>{
    var Authorization=req.headers.Authorization || req.headers.authorization
    if(Authorization && Authorization.startsWith("Bearer")){
        var token = Authorization.split(' ')[1]
        jwt.verify(token,process.env.JWT_SECRET,(err,info) =>{
            if(err){
                return next(new HttpError("Unauthorized.Invalid token",403))
            }
            req.user=info
            next()
        })
    }else {
        return next(new HttpError("Unauthorized. No token",403))
    }
}


module.exports=authMiddleware;
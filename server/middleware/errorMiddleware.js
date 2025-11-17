



var notFound=(req,res,next)=>{
    var error=new Error(`Not found -${req.originalUrl}`)
    res.status(404)
    next(error)
}




var errorHandler=(error,req,res,next)=>{
    if(res.headerSent){
        return next(error)
    }
    res.status(error.code || 500).json({message:error.message || "An unknown error occured"})
}

module.exports={notFound,errorHandler}
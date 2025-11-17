var HttpError=require("../models/ErrorModel")
var {v4:uuid}=require("uuid")
var cloudinary=require('../utils/cloudinary')
var ElectionModel=require('../models/electionModel')
var CandidateModel=require('../models/candidateModel')

var path=require("path")





//add new election
var addElection= async(req,res,next)=>{
try {
  if(!req.user.isAdmin){
    return next(new HttpError("Only an admin can perform this action",403))
   }

    var {title,description}=req.body;
    if(!title || !description){
        return next(new HttpError("Fill all fields",422))
    }
    if(!req.files.thumbnail){
        return next(new HttpError("Choose a thumbnail",422))
    }
    const {thumbnail}=req.files;
    if (thumbnail.size > 1000000){
        return next(new HttpError("File size too big"))
    }
    let fileName=thumbnail.name;
    fileName=fileName.split(".")
    fileName=fileName[0] + uuid() + "." + fileName[fileName.length -1]
    await thumbnail.mv(path.join(__dirname,'..', 'uploads',fileName),async(err)=>{
        if(err){
            return next(HttpError(err))
        }
        var result=await cloudinary.uploader.upload(path.join(__dirname,"..","uploads",fileName),{resource_type: "image"})
        if(!result.secure_url){
            return next(new HttpError("Could not upload image to cloudinary",422))
        }
        var newElection=await ElectionModel.create({title,description,thumbnail:result.secure_url})
        res.json(newElection)
    })
} catch (error) {
    return next(new HttpError(error))
}
}



//get election
var getElections=async(req,res,next)=>{
   try {
    var elections=await ElectionModel.find();
    res.status(200).json(elections)
   } catch (error) {
    return next(new HttpError(error))
   }
}


//get single election
var getElection=async(req,res,next)=>{
    try {
        var {id}=req.params;
        var election=await ElectionModel.findById(id)
        res.status(200).json(election)
    } catch (error) {
        return next(new HttpError(error))
    }
}


//Get election candidate
var getCandidatesOfElection=async(req,res,next)=>{
    try {
      var {id}=req.params;
      var candidates=await CandidateModel.find({election:id})
      res.status(200).json(candidates)   
    } catch (error) {
       return next(new HttpError(error))
    }
}



//get voters of an election
var getElectionVoters=async(req,res,next)=>{
    try {
       var {id} =req.params;
       var response=await ElectionModel.findById(id).populate('voters')
       res.status(200).json(response.voters) 
    } catch (error) {
       return next(new HttpError(error)) 
    }
}

//update election
var updateElection=async(req,res,next)=>{
   try {
    if(!req.user.isAdmin){
    return next(new HttpError("Only an admin can perform this action",403))
   }
      var {id}=req.params;
      var {title,description}=req.body;
      if(!title || !description){
        return next(new HttpError("Fill in all fields",422))
      }
            // If a new thumbnail file was uploaded, handle the image upload
            if(req.files && req.files.thumbnail){
                var {thumbnail}=req.files
                if(thumbnail.size>1000000){
                        return next(new HttpError("Image size too big. Should be less than 1mb",422))
                }
                let fileName=thumbnail.name;
                fileName=fileName.split(".")
                fileName=fileName[0] + uuid() + "." + fileName[fileName.length -1]
                // move and upload
                await thumbnail.mv(path.join(__dirname, '..','uploads',fileName))
                var result=await cloudinary.uploader.upload(path.join(__dirname, '..', 'uploads',fileName),{resource_type:"image"})
                if(!result || !result.secure_url){
                        return next(new HttpError("Image upload was not successful",422))
                }
                await ElectionModel.findByIdAndUpdate(id,{title,description,thumbnail:result.secure_url})
                return res.status(200).json({message: 'Election updated successfully'})
            }

            // No thumbnail uploaded — just update title and description
            await ElectionModel.findByIdAndUpdate(id,{title,description})
            return res.status(200).json({message: 'Election updated successfully'})
   } catch (error) {
     return next(new HttpError(error))
   }
}



//delete election
var removeElection=async(req,res,next)=>{
    if(!req.user.isAdmin){
    return next(new HttpError("Only an admin can perform this action",403))
   }

    try {
      var {id}=req.params;
      await ElectionModel.findByIdAndDelete(id);
       await CandidateModel.deleteMany({election:id})
       res.status(200).json("Election deleted successfully") 
    } catch (error) {
       return next(new HttpError(error))  
    }
}



module.exports={addElection,getElections,getElection,updateElection,removeElection,
    getCandidatesOfElection,getElectionVoters}
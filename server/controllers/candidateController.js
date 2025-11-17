var HttpError=require("../models/ErrorModel")
var {v4:uuid}=require("uuid")
var cloudinary=require('../utils/cloudinary')
var ElectionModel=require('../models/electionModel')
var CandidateModel=require('../models/candidateModel')
var mongoose=require("mongoose")
var VoterModel=require('../models/voterModel')
var path=require("path")
var {verifyVoterLocation, validateGeoLocationData} = require('../utils/geolocation')


var addCandidate=async(req,res,next)=>{
    try {
        if(!req.user || !req.user.isAdmin){
            return next(new HttpError("Only an admin can perform this action",403))
        }

        var {fullName,motto,currentElection}=req.body;
        if(!fullName || !motto || !currentElection){
            return next(new HttpError("Fill in all fields",422))
        }
        if(!req.files || !req.files.image){
            return next(new HttpError("Choose an image",422))
        }

        var {image}=req.files;
        if(image.size >1000000){
            return next(new HttpError("Image size should be less than 1mb",422))
        }

        let fileName=image.name;
        fileName=fileName.split(".")
        fileName=fileName[0] + uuid() + "." + fileName[fileName.length -1]

        // move file then run upload and DB transaction
        await image.mv(path.join(__dirname, '..', 'uploads',fileName))

        var result=await cloudinary.uploader.upload(path.join(__dirname,'..','uploads',fileName),{resource_type:"image"})
        if(!result || !result.secure_url){
            return next(new HttpError("Could not upload the image",422))
        }

        // start mongoose transaction
        const sess = await mongoose.startSession()
        sess.startTransaction()
        try {
            const newCandidate = new CandidateModel({fullName,motto,image:result.secure_url,election:currentElection})
            await newCandidate.save({session:sess})

            const election = await ElectionModel.findById(currentElection).session(sess)
            if(!election){
                await sess.abortTransaction()
                sess.endSession()
                return next(new HttpError('Election not found',404))
            }

            election.candidates.push(newCandidate._id)
            await election.save({session:sess})

            await sess.commitTransaction()
            sess.endSession()

            res.status(201).json({message: "Candidate added successfully", candidate:newCandidate})
        } catch (txErr){
            await sess.abortTransaction()
            sess.endSession()
            return next(new HttpError(txErr.message || 'Failed to add candidate',500))
        }

    } catch (error) {
        return next(new HttpError(error.message || 'Failed to add candidate',500))
    }
}

var getCandidate=async(req,res,next)=>{
   try {
    var {id}=req.params;
    var candidate=await CandidateModel.findById(id)
    res.json(candidate)
   } catch (error) {
    return next(new HttpError(error.message || 'Could not get candidate',500))
   }
}

var removeCandidate=async(req,res,next)=>{
    try {
    console.log('removeCandidate called', {params: req.params, user: req.user && {id: req.user.id, isAdmin: req.user.isAdmin}})
    if(!req.user || !req.user.isAdmin){
    console.log('removeCandidate unauthorized', {user: req.user})
    return next(new HttpError("Only an admin can perform this action",403))

   }
   var {id}=req.params;
   console.log('Looking up candidate id=', id)
   let currentCandidate=await CandidateModel.findById(id).populate('election')
   console.log('Found candidate:', !!currentCandidate)
   if(!currentCandidate){
    return next(new HttpError("Could not deletecandidate",422))
   }else{
        var sess=await mongoose.startSession()
        sess.startTransaction()
        try {
            await currentCandidate.deleteOne({session:sess})
            currentCandidate.election.candidates.pull(currentCandidate._id)
            await currentCandidate.election.save({session:sess})
            await sess.commitTransaction()
            sess.endSession()
            return res.status(200).json({message: 'Candidate deleted successfully'})
        } catch (txErr) {
            await sess.abortTransaction()
            sess.endSession()
            return next(new HttpError(txErr.message || 'Failed to delete candidate',500))
        }
   }
    } catch (error) {
    return next(new HttpError(error.message || 'Failed to delete candidate',500))
    }
}



var voteCandidate=async(req,res,next)=>{
    try {
      var {id:candidateId}=req.params
      var {selectedElection, latitude, longitude, accuracy}=req.body
      
      // Validate geolocation data if provided
      if(latitude !== undefined && longitude !== undefined){
        const geoValidation = validateGeoLocationData(latitude, longitude, accuracy)
        if(!geoValidation.valid){
          return next(new HttpError(geoValidation.error, 422))
        }
      }

      var candidate=await CandidateModel.findById(candidateId)
            if(!candidate) return next(new HttpError('Candidate not found',404))
      
      // Fetch election with geolocation info
      let election=await ElectionModel.findById(selectedElection)
      if(!election) return next(new HttpError('Election not found',404))
      
      // Verify geolocation if election requires it
      if(election.requiresGeoVerification && latitude !== undefined && longitude !== undefined){
        const locationCheck = verifyVoterLocation(latitude, longitude, election.region)
        if(!locationCheck.allowed){
          return next(new HttpError(locationCheck.reason, 403))
        }
      }

      var newVoteCount=candidate.voteCount + 1  
      await CandidateModel.findByIdAndUpdate(candidateId,{voteCount:newVoteCount},{new:true})
      var sess=await mongoose.startSession()
      sess.startTransaction()
            let voter=await VoterModel.findById(req.user.id)
            // prevent double voting in the same election
            if(voter.votedElections && voter.votedElections.find(ev => ev.toString() === selectedElection)){
                await sess.endSession()
                return next(new HttpError('You have already voted in this election',409))
            }
      
      // Store geolocation data
      if(latitude !== undefined && longitude !== undefined){
        voter.lastLocation = {
          latitude,
          longitude,
          accuracy,
          timestamp: new Date()
        }
        voter.votingLocations.push({
          electionId: selectedElection,
          latitude,
          longitude,
          timestamp: new Date()
        })
      }
      
      await voter.save({session:sess})
      election.voters.push(voter)
      voter.votedElections.push(election)
      await election.save({session:sess})
      await voter.save({session:sess})
      await sess.commitTransaction()
      res.status(200).json({
        message: 'Vote recorded successfully',
        votedElections: voter.votedElections,
        location: latitude ? {latitude, longitude, accuracy} : null
      })
    } catch (error) {
         return next(new HttpError(error.message || 'Failed to vote',500))   
    }
}



module.exports={addCandidate,getCandidate,removeCandidate,voteCandidate}
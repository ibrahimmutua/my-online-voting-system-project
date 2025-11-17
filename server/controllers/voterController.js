var bcrypt=require('bcryptjs')
var jwt=require('jsonwebtoken')
var VoterModel=require('../models/voterModel')
var HttpError=require('../models/ErrorModel')
//register
var registerVoter= async(req,res,next)=>{
    try{
       var {fullName,email,password,password2}=req.body; 
       if (!fullName || !email || !password || !password2){
        return next(new HttpError("Fill in all fields.",422))
       }
       var newEmail=email.toLowerCase()
       var emailExists=await VoterModel.findOne({email:newEmail})
       if(emailExists){
        return next(new HttpError("Email already exist",422))
       }
       if((password.trim().length) <6){
        return next(new HttpError("Password should be at least 6 characters.",422))
       }
       if(password !=password2){
         return next(new HttpError("Password do not match.",422))
       }
       var salt=await bcrypt.genSalt(10);
       var hashPassword=await bcrypt.hash(password,salt);
       let isAdmin=false;
       if(newEmail=="achiever@gmail.com"){
        isAdmin=true
       }
       var newVoter=await VoterModel.create({fullName,email:newEmail,
        password:hashPassword,isAdmin})
        res.status(201).json(`new voter ${fullName} created.`)
    } catch (error){
        return next(new HttpError('Voter registration failed.',422))
    }
}





var generateToken=(payload)=>{
    var token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1d"})
    return token;
}

//login

var loginVoter=async(req,res,next)=>{
    try{
      var {email,password}=req.body
      if(!email || !password){
        return next(new HttpError("Fill in all fields",422))
      }
      var newEmail=email.toLowerCase()
      var voter=await VoterModel.findOne({email:newEmail})
      if(!voter){
        return next(new HttpError("Invalid credentials",422))
      }
      var comparePass=await bcrypt.compare(password,voter.password)
      if(!comparePass){
        return next(new HttpError("Invalid credatial",422))
      }
      var {_id:id,isAdmin,votedElections}=voter;
      var token=generateToken({id,isAdmin})

      res.json({token,id,votedElections,isAdmin})
    }catch(error){
        return next(new HttpError("Login failed .Please check your credentials or try  again later",422))
    }
}




//get voter

var getVoter=async(req,res,next)=>{
    try{
        var {id}=req.params;
        var voter=await VoterModel.findById(id).select("-password")
        res.json(voter)
    } catch(error){
        return next(HttpError("Couldn't get voter",404))
    }
}





module.exports={registerVoter,loginVoter,getVoter};
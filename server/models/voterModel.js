var {Schema , model , Types}=require('mongoose')

var voterSchema=new Schema({
    fullName:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    votedElections:[{type:Types.ObjectId,ref:"Election",required:true}],
    isAdmin:{type:Boolean,default:false},
    // Geolocation tracking
    lastLocation: {
      latitude: {type:Number},
      longitude: {type:Number},
      accuracy: {type:Number},
      timestamp: {type:Date}
    },
    votingLocations: [{
      electionId: {type:Types.ObjectId, ref:"Election"},
      latitude: {type:Number},
      longitude: {type:Number},
      timestamp: {type:Date}
    }]
},{timestamps:true})



module.exports=model('Voter',voterSchema)

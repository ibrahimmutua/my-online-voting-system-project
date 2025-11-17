var {Schema ,model ,Types}=require("mongoose")

var electionSchema=new Schema({
    title: {type:String, required:true},
    description: {type:String, required:true},
    thumbnail: {type:String, required:true},
    candidates:[{type:Types.ObjectId,required:true,ref:"Candidate"}],
    voters:[{type:Types.ObjectId,required:true,ref:"Voter"}],
    // Geolocation verification fields
    region: {
      name: {type:String, required:true, default:"All Regions"},
      centerLatitude: {type:Number, required:true, default:0},
      centerLongitude: {type:Number, required:true, default:0},
      radiusKm: {type:Number, required:true, default:50}
    },
    requiresGeoVerification: {type:Boolean, default:false},
    createdAt: {type:Date, default:Date.now}
})


module.exports=model("Election",electionSchema)

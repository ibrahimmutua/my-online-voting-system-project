var {Schema , model , Types}=require('mongoose')


var candidateSchema=new Schema({
    fullName:{type:String,required:true},
    image:{type:String,required:true},
    motto:{type:String,required:true},
    voteCount:{type:Number,default:0},
    election:{type:Types.ObjectId,required:true,ref:"Election"}
},{timestamps:true})


module.exports=model('Candidate',candidateSchema)
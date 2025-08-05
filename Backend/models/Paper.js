import mongoose from "mongoose";
import User from "./user";

const paperSchema=new mongoose.Schema({
  title:String,
  semester:String,
  subject:String,
  fileUrl:String,
  uploadedBy:{type:mongoose.Schema.Types.ObjectId,ref:User}
},{timestamps:true});

const Paper=mongoose.model('Paper',paperSchema);
export default Paper;
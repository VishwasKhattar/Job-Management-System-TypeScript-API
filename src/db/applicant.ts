import mongoose , { Document } from "mongoose";



export interface IApplication extends Document {
    jobId: string;
    applicantId: string;
}

const applicationSchema = new mongoose.Schema({
    jobId:{
        type:String,
        required:true,
    },
    applicantId:{
        type:String,
        required:true,
    }
});

export default mongoose.model<IApplication>('Applications' , applicationSchema);
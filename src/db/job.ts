import mongoose , { Document } from "mongoose";



export interface IJob extends Document {
    title: string;
    description: string;
    category: string;
    creatorId: string;
}
``
const jobSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    creatorId:{
        type:String,
        unique:true,
        required : true
    }
});

export default mongoose.model<IJob>('Jobs' , jobSchema);
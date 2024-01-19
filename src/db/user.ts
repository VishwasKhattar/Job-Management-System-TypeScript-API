//Defining the User Model


import mongoose ,  {Document} from "mongoose";

export interface IUser extends Document {
    username : string,
    email : string,
    password : string,
    interest:string
}

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    interest:{
        type:String,
    }
});

export default mongoose.model<IUser>('User' , userSchema);
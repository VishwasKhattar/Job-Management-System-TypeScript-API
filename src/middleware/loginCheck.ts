import { Request , Response} from "express";


const loginCheck = (req : Request , res : Response , next: ()=>void) => {
    const checkLogin = req.cookies;
    if(!checkLogin){
        res.status(401).json({error:"Unauthorized Login First"});
    }
    else{
        next();
    }

}

export default loginCheck;
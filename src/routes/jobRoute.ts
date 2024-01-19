import express from 'express';
import { createJob , applyJob} from '../controller/jobController';
import loginCheck from '../middleware/loginCheck';


const router = express.Router();

router.post('/createJob' , loginCheck , createJob);
router.post('/applyJob' , loginCheck , applyJob);

export default router;
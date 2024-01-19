import { Request, Response } from "express";
import Jobs, { IJob } from "../db/job";
import { jwtDecode } from "jwt-decode";
import Applications, { IApplication } from "../db/applicant";
import nodemailer from "nodemailer";
import User , {IUser} from "../db/user";

interface MyToken {
    userId: string;
    iat: number;
    exp: number;
    token: string;
}

export const createJob = async (req: Request, res: Response) => {
    const token = req.cookies.jwt;
    const decodedToken = jwtDecode<MyToken>(token);
    const creatorId = decodedToken.userId;

    try {
        const { title, description, category } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({ message: "Enter all the required fields" });
        }

        const newJob: IJob = new Jobs({
            title,
            description,
            category,
            creatorId: creatorId,
        });

        const result: IJob | null = await newJob.save();

        // Notify interested users
        await notifyInterestedUsers(category, result);

        res.json(result);
    } catch (e) {
        console.log(e);
        res.json({ error: e });
    }
};

// Function to notify interested users via email
async function notifyInterestedUsers(category: string, job: IJob | null) {
    try {
        // Find users interested in the job category
        const interestedUsers = await Applications.find({
            jobId: { $ne: job?._id }, // Exclude the job creator from notifications
        })
            .distinct("applicantId")
            .exec();

        // Get user emails
        const userEmails = await User.find({
            _id: { $in: interestedUsers },
            interest: category,
        })
            .distinct("email")
            .exec();

        // Send email notifications
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER, // Add your Gmail email here
                pass: process.env.GMAIL_PASS, // Add your Gmail password here
            },
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: userEmails.join(", "),
            subject: `New Job Alert - ${job?.title}`,
            text: `A new job (${job?.title}) in category ${category} has been posted. Check it out!`,
        };

        await transporter.sendMail(mailOptions);
        console.log("Emails sent to interested users for new job:", job?.title);
    } catch (error) {
        console.error("Error notifying interested users:", error);
    }
}

export const applyJob = async (req: Request, res: Response) => {
    const token = req.cookies.jwt;

    const decodedToken = jwtDecode<MyToken>(token);
    const applicantId = decodedToken.userId;

    try {

        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({ message: "Enter all the required fields" });
        }
    
        const newApplication : IApplication | null = new Applications({
            jobId,
            applicantId:applicantId
        });

        const result = await newApplication.save();
        res.status(200).json({message : `Applied Successfully for Job Id : ${jobId}`});

    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e })
    }
}
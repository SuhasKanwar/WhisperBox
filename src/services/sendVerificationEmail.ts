import nodemailer from 'nodemailer';
import { ApiResponse } from '@/src/types/ApiResponse';

export async function sendVerificationEmail(
    email: string,
    username: string,
    otp: string
) : Promise<ApiResponse>{
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'WhisperBox | Verification Code',
            text: `Hello ${username},\n\nYour verification code is ${otp}\n\nThanks,\nWhisperBox Team`,
        });
        return {
            success: true,
            message: "Verification email sent successfully"
        };
    }
    catch(err) {
        console.error("Error sending verification email.", err);
        return {
            success: false,
            message: "Failed to send verification email"
        };
    }
}
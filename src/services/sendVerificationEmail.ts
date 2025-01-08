import { resend } from '@/lib/resend';
import VerificationEmail from '../../components/server/VerificationEmail';
import { ApiResponse } from '@/src/types/ApiResponse';

export async function sendVerificationEmail(
    email: string,
    username: string,
    otp: string
) : Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'WhisperBox | Verification Code',
            react: VerificationEmail({ username, otp })
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
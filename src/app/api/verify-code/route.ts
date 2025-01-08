import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/models/User";
import { verifySchema } from "@/src/schemas/verifySchema";

export async function POST(request: Request){
    await dbConnect();
    try{
        const { username, otp } = await request.json();

        const validationResult = verifySchema.safeParse({ code: otp });
        
        if(!validationResult.success){
            return Response.json(
                {
                    success: false,
                    message: validationResult.error.errors[0].message
                },
                {
                    status: 400
                }
            );
        }

        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });

        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            );
        }

        const isOtpValid = user.otp === otp;
        const isOtpNotExpired = new Date() < new Date(user.otpExpiry);
        if(isOtpValid && isOtpNotExpired){
            user.isVerified = true;
            await user.save();
            return Response.json(
                {
                    success: true,
                    message: "Account verified successfully"
                },
                {
                    status: 200
                }
            );
        }
        else if(!isOtpNotExpired){
            return Response.json(
                {
                    success: false,
                    message: "OTP has expired"
                },
                {
                    status: 400
                }
            );
        }
        else{
            return Response.json(
                {
                    success: false,
                    message: "Invalid OTP"
                },
                {
                    status: 400
                }
            );
        }
    }
    catch(err){
        console.error("Error verifying user: ", err);
        return Response.json(
            {
                success: false,
                message: "Error verifying user"
            },
            {
                status: 500
            }
        );
    }
}
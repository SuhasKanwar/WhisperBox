import dbConnect from "@/lib/dbConnect";
import UserModel from "@/src/models/User";
import { z } from "zod";
import { usernameValidation } from "@/src/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(request: Request) {
    await dbConnect();
    try{
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username")
        }

        // Validating with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        if(!result.success){
            const usernameError = result.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message: usernameError?.length > 0 ? usernameError.join(', ') : "Invalid Query Parameters"
                },
                {
                    status: 400
                }
            );
        }
        const { username } = result.data;
        const existingVerifiedUser = await UserModel.findOne({ username: username, isVerified: true });
        if(existingVerifiedUser){
            return Response.json(
                {
                    success: false,
                    message: "Username already exists"
                },
                {
                    status: 400
                }
            );
        }
        return Response.json(
            {
                success: true,
                message: "Username is unique"
            },
            {
                status: 200
            }
        );
    }
    catch(err){
        console.error("Error checking for unique username: ", err);
        return Response.json(
            {
                success: false,
                message: "Error checking for unique username"
            },
            {
                status: 500
            }
        );
    }
}
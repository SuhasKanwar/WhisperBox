import dbConnect from "@/lib/dbConnect";
import UserModel from "@/src/models/User";
import { Message } from '@/src/models/Messages';

export async function POST(request: Request){
    await dbConnect();

    const { username, message } = await request.json();
    try{
        const user = await UserModel.findOne({ username: username });
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
        if(!user.isAcceptingMessages){
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting messages"
                },
                {
                    status: 403
                }
            );
        }
        const newMessage = {
            content: message,
            createdAt: new Date()
        }
        user.messages.push(newMessage as Message);
        await user.save();
        return Response.json(
            {
                success: true,
                message: "Message sent successfully"
            },
            {
                status: 200
            }
        );
    }
    catch(err){
        console.error("Error sending the message:", err);
        return Response.json(
            {
                success: false,
                message: "An error unexpected occurred"
            },
            {
                status: 500
            }
        );
    }
}
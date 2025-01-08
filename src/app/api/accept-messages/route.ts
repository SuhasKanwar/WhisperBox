import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/src/lib/dbConnect';
import UserModel from '@/src/models/User';
import { User } from 'next-auth';


export async function POST(request: Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "User not authenticated"
            },
            {
                status: 401
            }
        );
    }

    const userID = user._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userID, { isAcceptingMessages: acceptMessages }, { new: true });
        if(!updatedUser){
            return Response.json(
                {
                    success: false,
                    message: "Failed to update the status code to accept messages"
                },
                {
                    status: 401
                }
            );
        }
        return Response.json(
            {
                success: true,
                message: "Message acceptance status updated successfully"
            },
            {
                status: 200
            }
        );
    }
    catch(err){
        console.error("Failed to update the status code to accept messages", err);
        return Response.json(
            {
                success: false,
                message: "Failed to update the status code to accept messages"
            },
            {
                status: 500
            }
        );
    }
}
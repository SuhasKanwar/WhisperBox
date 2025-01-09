import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/src/models/User';
import { User } from 'next-auth';

export async function DELETE(request: Request, { params }: { params: { messageID: string } }) {
    const messageID = await params.messageID;
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

    try{
        const updatedUser = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageID } } }
        );
        if(updatedUser.modifiedCount == 0){
            return Response.json(
                {
                    success: false,
                    message: "Message not found or already deleted"
                },
                {
                    status: 404
                }
            );
        }
        return Response.json(
            {
                success: true,
                message: "Message deleted"
            },
            {
                status: 200
            }
        );
    }
    catch(err){
        console.error("Error in deleting the message", err);
        return Response.json(
            {
                success: false,
                message: "Error deleting message"
            },
            {
                status: 500
            }
        )
    }
}
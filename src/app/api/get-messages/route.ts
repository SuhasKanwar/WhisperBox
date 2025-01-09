import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/src/models/User';
import { User } from 'next-auth';
import mongoose from 'mongoose';

export async function GET(request: Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const userS: User = session?.user as User;

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

    const userID = new mongoose.Types.ObjectId(userS._id);
    try{
        const user = await UserModel.aggregate([
            { $match: { _id: userID } },
            { $unwind: "$messages" },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ]);
        if(!user || user.length === 0){
            return Response.json(
                {
                    success: false,
                    message: "User not found or no messages found"
                },
                {
                    status: 404
                }
            );
        }
        return Response.json(
            {
                success: true,
                message: "Messages retrieved",
                messages: user[0].messages
            },
            {
                status: 200
            }
        );
    }
    catch(err){
        return Response.json(
            {
                success: false,
                message: "Error retrieving messages"
            },
            {
                status: 500
            }
        );
    }
}
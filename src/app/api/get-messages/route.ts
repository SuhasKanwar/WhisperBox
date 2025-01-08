import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/src/lib/dbConnect';
import UserModel from '@/src/models/User';
import { User } from 'next-auth';
import mongoose from 'mongoose';

export async function GET(request: Request){
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

    const userID = new mongoose.Types.ObjectId(user._id);
    try{
        const user = await UserModel.aggregate([
            { $match: { _id: userID } },
            { $unwind: "$messages" },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ]);
    }
    catch(err){
    }
}
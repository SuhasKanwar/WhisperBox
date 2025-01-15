import mongoose, { Schema, Document } from "mongoose";
import { Message, MessageSchema } from './Messages';

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    otp: string;
    otpExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, "Please use a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    otp: {
        type: String,
        required: [true, "OTP is required"],
        default: ''
    },
    otpExpiry: {
        type: Date,
        required: [true, "OTP expiry not provided"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true 
    },
    messages: [MessageSchema]
});

const UserModel = (mongoose.models.Users as mongoose.Model<User>) || mongoose.model<User>("Users", UserSchema);

export default UserModel;
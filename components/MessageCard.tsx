"use client";

import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Trash2, Calendar, Clock } from 'lucide-react';
import { Message } from "@/src/models/Messages";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ApiResponse } from "@/src/types/ApiResponse";
import { format } from "date-fns";

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    const { toast } = useToast();

    const handleDelete = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
            toast({
                title: "Message deleted",
                description: response.data.message,
                variant: "default",
            });
            let mssgID = message._id as string;
            onMessageDelete(mssgID);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete message. Please try again.",
                variant: "destructive",
            });
        }
    }

    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-muted-foreground">
                        <Calendar className="w-4 h-4 inline-block mr-1" />
                        {format(new Date(message.createdAt), 'PPP')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 inline-block mr-1" />
                        {format(new Date(message.createdAt), 'p')}
                    </p>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="w-4 h-4" />
                            <span className="sr-only">Delete message</span>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete this message?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the
                                message from your inbox.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-sm">{message.content}</p>
            </CardContent>
        </Card>
    );
};

export default MessageCard;
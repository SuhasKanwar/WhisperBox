"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { Message } from "@/src/models/Messages";
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { acceptMessagesSchema } from '@/src/schemas/acceptMessageSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/src/types/ApiResponse';
import { User } from 'next-auth';

const DashboardPage = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);

    const { toast } = useToast();

    const handleDeleteMessages = (messageID: string) => {
        setMessages(messages.filter((message) => message.id !== messageID));
    }

    const { data: session } = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessagesSchema)
    });

    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages');

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true);
        try{
            const response = await axios.get<ApiResponse>('/api/accept-messages');
            setValue('acceptMessages', response.data.isAcceptingMessages);
        }
        catch(err){
            const axiosError = err as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || axiosError.message || "Failed to fetch message settings",
                variant: 'destructive'
            });
        }
        finally{
            setIsSwitchLoading(false);
        }
    }, [setValue]);

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        setIsSwitchLoading(true);
        try{
            const response = await axios.get<ApiResponse>('/api/get-messages');
            setMessages(response.data.messages || []);
            if(refresh){
                toast({
                    title: 'Refreshed Messages',
                    description: 'Showing the latest messages'
                });
            }
        }
        catch(err){
            const axiosError = err as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || axiosError.message || "Failed to fetch messages",
                variant: 'destructive'
            });
        }
        finally{
            setIsLoading(false);
            setIsSwitchLoading(false);
        }
    }, [setIsLoading, setMessages]);

    useEffect(() => {
        if(!session || !session.user){
            return;
        }
        fetchMessages();
        fetchAcceptMessage();
    }, [session, setValue, fetchAcceptMessage, fetchMessages]);

    // Handle switch change
    const handleSwitchChange = async () => {
        try{
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages
            });
            setValue('acceptMessages', !acceptMessages);
            toast({
                title: response.data.message,
                variant: 'default'
            });
        }
        catch(err){
            const axiosError = err as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || axiosError.message || "Failed to update message settings",
                variant: 'destructive'
            });
        }
    }

    const { username } = session?.user as User;
    const baseURL = `${window.location.protocol}//${window.location.host}`;
    const profileURL = `${baseURL}/u/${username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileURL);
        toast({
            title: 'URL copied to clipboard',
            description: 'Your profile URL has been copied to the clipboard'
        });
    }

    if(!session || !session.user){
        <div>Please Login</div>
    }

    return (
        <div>
            <h1>Dashboard Page</h1>
        </div>
    );
}

export default DashboardPage;
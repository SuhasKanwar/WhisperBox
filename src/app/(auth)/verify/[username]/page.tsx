import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/src/schemas/verifySchema';
import { ApiResponse } from '@/src/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const VerifyAccountPage = () => {
    const router = useRouter();
    const params = useParams<{username: string}>();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try{
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            });

            toast({
                title: "Success",
                description: response.data.message,
            });

            router.replace('/sign-in');
        }
        catch(err){
            console.error("Error verifying account", err);
            const axiosError = err as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message || "An error occurred verifying account";
            toast({
                title: "Verification Failed",
                description: errorMessage,
                variant: "destructive"
            });
        }
    }

    return (
        <div>
        </div>
    );
}

export default VerifyAccountPage;
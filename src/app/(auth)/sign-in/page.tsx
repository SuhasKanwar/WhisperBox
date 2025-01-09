"use client";

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useDebounceValue } from 'usehooks-ts';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/src/schemas/signUpSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/src/types/ApiResponse';

const SignInPage = () => {
  const [username, setusername] = useState('');
  const [usernameMessage, setusernameMessage] = useState('');
  const [isCheckingUsername, setisCheckingUsername] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const router = useRouter();

  const debouncedUsername = useDebounceValue(username, 500);

  const { toast } = useToast();

  // zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    const checkUniqueUsername = async () => {
      if(debouncedUsername){
        setisCheckingUsername(true);
        setusernameMessage('');
        try{
          const response = await axios.get(`/api/check-unique-username?username=${debouncedUsername}`);
          setusernameMessage(response.data.message);
        }
        catch(err){
          const axiosError = err as AxiosError<ApiResponse>;
          setusernameMessage(axiosError.response?.data.message ?? "Error Checking Username");
        }
        finally{
          setisCheckingUsername(false);
        }
      }
    }
    checkUniqueUsername();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setisSubmitting(true);
    try{
      const response = await axios.post('/api/sign-up', data);
      toast({
        title: "Success",
        description: response.data.message
      });
      router.replace(`/verify/${username}`);
    }
    catch(err){
      console.error("Error signing up user", err);
      const axiosError = err as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message ?? "Error Signing Up User";
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
    finally{
      setisSubmitting(false);
    }
  };

  return (
    <div>
    </div>
  )
}

export default SignInPage;
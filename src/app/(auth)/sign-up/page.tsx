"use client";

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useDebounceCallback } from 'usehooks-ts';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/src/schemas/signUpSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/src/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const SignUpPage = () => {
  const [username, setusername] = useState('');
  const [usernameMessage, setusernameMessage] = useState('');
  const [isCheckingUsername, setisCheckingUsername] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  
  const router = useRouter();
  const debounced = useDebounceCallback(setusername, 500);
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
      if(username){
        setisCheckingUsername(true);
        setusernameMessage('');
        try{
          const response = await axios.get(`/api/check-unique-username?username=${username}`);
          let message = response.data.message;
          setusernameMessage(message);
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
  }, [username]);

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
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        
        <div className="text-center">
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Join WhisperBox</h1>
          <p className='mb-4'>Sign up to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className='animate-spin'/>}
                  <p className={`text-sm ${usernameMessage === 'Username is unique' ? 'text-green-600' : 'text-red-600'}`}>
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' disabled={isSubmitting}>
              {
                isSubmitting ?
                (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please Wait
                  </>
                ) : ('Signup')
              }
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href='/sign-in' className='text-blue-600 hover:text-blue-800'>Sign in</Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default SignUpPage;
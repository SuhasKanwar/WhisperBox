"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Message } from "@/src/models/Messages";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessagesSchema } from "@/src/schemas/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/src/types/ApiResponse";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw, Copy, LinkIcon } from 'lucide-react';
import MessageCard from "@/components/MessageCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageID: string) => {
    setMessages(messages.filter((message) => message.id !== messageID));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          axiosError.message ||
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing the latest messages",
          });
        }
      } catch (err) {
        const axiosError = err as AxiosError<ApiResponse>;
        setMessages([]);
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ||
            axiosError.message ||
            "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (!session || !session.user) {
      return;
    }
    fetchMessages();
    fetchAcceptMessage();
  }, [session, fetchAcceptMessage, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          axiosError.message ||
          "Failed to update message settings",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>Please log in to view your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" className="w-full" asChild>
            <a href="/sign-in">Go to Login</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { username } = session?.user as User;
  const baseURL = `${window.location.protocol}//${window.location.host}`;
  const profileURL = `${baseURL}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileURL);
    toast({
      title: "URL copied to clipboard",
      description: "Your profile URL has been copied to the clipboard",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">User Dashboard</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Unique Link</CardTitle>
            <CardDescription>Share this link to receive messages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="relative flex-grow">
                <LinkIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  type="text"
                  value={profileURL}
                  readOnly
                  className="pl-8 pr-20"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Message Settings</CardTitle>
            <CardDescription>Control whether you can receive new messages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="accept-messages" className="text-base">
                Accept Messages
              </Label>
              <Switch
                id="accept-messages"
                {...register("acceptMessages")}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Messages</CardTitle>
            <CardDescription>View and manage your received messages</CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchMessages(true)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
        </CardHeader>
        <CardContent>
          {messages.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {messages.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No messages to display.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
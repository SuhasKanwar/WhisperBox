'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { messageSchema } from '@/src/schemas/messageSchema'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Toaster } from "@/components/ui/toaster"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, MessageSquare, Sparkles, RefreshCw } from 'lucide-react'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import { Typewriter } from 'react-simple-typewriter'
import { useToast } from "@/hooks/use-toast"

type FormData = {
  content: string
}

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(messageSchema)
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: params.username, message: data.content })
      })
      const result = await response.json()
      if (result.success) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
        toast({
          title: "Message sent!",
          description: "Your message has been delivered successfully.",
          duration: 3000,
        })
        setValue('content', '')
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSuggestions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/suggest-messages', { method: 'POST' })
      const result = await response.json()
      if (result.success) {
        setSuggestions(result.data.messages.split('||'))
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error)
      toast({
        title: "Error",
        description: "Failed to fetch message suggestions. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSuggestions()
  }, [])

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="w-full mx-auto">
        <CardHeader className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${params.username}`} />
            <AvatarFallback>{params.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold">
            <Typewriter
              words={[`Message ${params.username}`]}
              loop={1}
              cursor
              cursorStyle='_'
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </CardTitle>
          <CardDescription>Send a friendly message or ask a question!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Textarea
              placeholder="Type your message here..."
              {...register('content')}
              className="min-h-[100px] text-lg"
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
            <Button 
              type="submit" 
              className="w-full text-lg" 
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Send Message
            </Button>
          </form>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-yellow-500" />
              Message Suggestions
            </h3>
            <AnimatePresence>
              <motion.div 
                className="grid grid-cols-1 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full text-left h-auto whitespace-normal"
                      onClick={() => setValue('content', suggestion, { shouldValidate: true })}
                    >
                      {suggestion}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
            <Button 
              onClick={fetchSuggestions} 
              className="w-full mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MessageSquare className="mr-2 h-4 w-4" />
              )}
              Get New Suggestions
            </Button>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg text-center shadow-inner">
            <h3 className="text-xl font-semibold mb-2">Want your own message board?</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300">Create an account and start receiving messages from friends!</p>
            <Button variant="secondary" className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white">
              Create Account
            </Button>
          </div>
        </CardContent>
      </div>
      <Toaster />
    </div>
  )
}
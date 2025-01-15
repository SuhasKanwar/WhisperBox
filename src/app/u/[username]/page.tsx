'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { messageSchema } from '@/src/schemas/messageSchema'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/toaster"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Sparkles, RefreshCw } from 'lucide-react'
import confetti from 'canvas-confetti'
import { Typewriter } from 'react-simple-typewriter'
import { useToast } from "@/hooks/use-toast"
import axios from 'axios'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'

type FormData = {
  content: string
}

const initialSuggestions = [
  "What's your favorite way to spend a weekend?",
  "Do you like somebody?",
  "If you could instantly master any skill, what would it be?"
]

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>()
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>(initialSuggestions)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const { toast } = useToast()
  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(messageSchema)
  })

  const fetchSuggestions = async () => {
    setIsLoadingSuggestions(true)
    const currentMessage = watch('content') || "Hello, how are you?"
    try {
      const response = await axios.post('/api/suggest-messages', {
        message: currentMessage
      })
      if (response.data.success) {
        const messages = response.data.data.messages.split('||')
        setSuggestions(messages)
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error)
      setSuggestions(initialSuggestions)
    } finally {
      setIsLoadingSuggestions(false)
    }
  }  

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const response = await axios.post('/api/send-message', {
        username: username,
        message: data.content
      })
      
      if (response.data.success) {
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
        throw new Error(response.data.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: axios.isAxiosError(error) 
          ? error.response?.data?.message || "Failed to send message"
          : "Failed to send message",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div 
      className="container mx-auto p-4 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.section 
        className="flex flex-col md:flex-row gap-6"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex-1 flex flex-col">
          <div className="mb-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${username}`} alt={`${username}'s avatar`} />
              <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <Typewriter
              words={[`Message ${username}`]}
              loop={1}
              cursor
              cursorStyle='_'
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
            <p>Send a friendly message or ask a question!</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Textarea
              placeholder="Type your message here..."
              {...register('content')}
              className="min-h-[200px] text-lg"
              aria-label="Message content"
            />
            {errors.content && (
              <p className="text-red-500 text-sm" role="alert">{errors.content.message}</p>
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
        </div>

        <motion.div 
          className="flex-1 md:w-64 space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">Message Ideas</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={fetchSuggestions}
              disabled={isLoadingSuggestions}
              aria-label={isLoadingSuggestions ? "Loading new suggestions" : "Get new suggestions"}
            >
              {isLoadingSuggestions ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Button
                  variant="outline"
                  className="w-full text-left h-auto whitespace-normal"
                  onClick={() => setValue('content', suggestion)}
                >
                  {suggestion}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>
      
      <motion.section
        className="mt-8 p-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg text-center shadow-inner"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-2">Want your own message board?</h3>
        <p className="mb-4 text-gray-600 dark:text-gray-300">Create an account and start receiving messages from friends!</p>
        <Button variant="secondary" className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white">
          <Link href="/sign-up">Create Account</Link>
        </Button>
      </motion.section>
      <Toaster />
    </motion.div>
  )
}
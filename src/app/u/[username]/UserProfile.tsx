'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { messageSchema } from '@/src/schemas/messageSchema'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, MessageSquare } from 'lucide-react'
import { useToast } from "@/hooks/use-toast";

type FormData = {
  content: string
}

export default function UserProfile({ username }: { username: string }) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const { toast } = useToast()
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(messageSchema)
  })

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, message: data.content })
      })
      const result = await response.json()
      if (result.success) {
        toast({
          title: "Message sent",
          description: "Your message has been sent successfully.",
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
      })
    }
  }

  const fetchSuggestions = async () => {
    try {
      const response = await fetch('/api/suggest-messages', { method: 'POST' })
      const result = await response.json()
      if (result.success) {
        setSuggestions(result.data.messages.split('||'))
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Message {username}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Textarea
            placeholder="Type your message here..."
            {...register('content')}
            className="min-h-[100px]"
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
          <Button type="submit" className="w-full">
            <Send className="mr-2 h-4 w-4" /> Send Message
          </Button>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Message Suggestions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => setValue('content', suggestion, { shouldValidate: true })}
              >
                {suggestion}
              </Button>
            ))}
          </div>
          {suggestions.length === 0 && (
            <Button onClick={fetchSuggestions} className="w-full mt-4">
              <MessageSquare className="mr-2 h-4 w-4" /> Get Suggestions
            </Button>
          )}
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center">
          <h3 className="text-lg font-semibold mb-2">Want your own message board?</h3>
          <p className="mb-4">Create an account to get started!</p>
          <Button variant="secondary">Create Account</Button>
        </div>
      </CardContent>
    </Card>
  )
}
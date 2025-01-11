'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Lock } from 'lucide-react'

const whispers = [
  "Secrets unfold...",
  "Whispers echo...",
  "Anonymity preserved...",
  "Messages materialize...",
  "Voices in the void...",
]

const LoadingComponent = () => {
  const [currentWhisper, setCurrentWhisper] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWhisper((prev) => (prev + 1) % whispers.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 to-indigo-800 flex flex-col items-center justify-center p-4">
      <div className="relative w-64 h-64">
        {/* Outer rotating circle */}
        <motion.div
          className="absolute inset-0 border-4 border-purple-300 rounded-full opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner pulsating circle */}
        <motion.div
          className="absolute inset-4 bg-purple-500 rounded-full opacity-10"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating message bubbles */}
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute"
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{
              scale: [0, 1, 0],
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: index * 0.8,
              ease: "easeInOut",
            }}
          >
            <MessageCircle className="text-purple-200 w-8 h-8" />
          </motion.div>
        ))}

        {/* Central lock icon */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [1, 0.8, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Lock className="text-purple-100 w-16 h-16" />
        </motion.div>
      </div>

      {/* Whisper text */}
      <div className="mt-8 h-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentWhisper}
            className="text-xl text-center text-purple-200"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {whispers[currentWhisper]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Loading dots */}
      <div className="mt-4 flex space-x-2">
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-purple-300 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default LoadingComponent;
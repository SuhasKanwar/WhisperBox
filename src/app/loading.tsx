'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { ChevronRight, Loader2 } from 'lucide-react'

const LoadingPage = () => {
  const router = useRouter()
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-block"
        >
          <Loader2 className="w-16 h-16 md:w-24 md:h-24 text-gray-800 dark:text-gray-200" />
        </motion.div>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mt-4 mb-8">
          Crafting elegance...
        </p>
      </motion.div>

      <motion.div
        className="w-16 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mb-8"
        initial={{ width: 0 }}
        animate={{ width: '4rem' }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />

      <div className="relative mb-8">
        <AnimatePresence>
          {isHovering && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-2 rounded-md shadow-lg"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">Patience is a virtue</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className="text-gray-500 dark:text-gray-400 flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <p className="text-sm">Preparing your experience</p>
      </motion.div>

      <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-gray-400">
        <span>© {new Date().getFullYear()} Classy Company</span>
        <span>Loading with sophistication</span>
      </div>
    </div>
  )
}

export default LoadingPage;
"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/src/data/message.json";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from 'lucide-react';
import Link from "next/link";

const BackgroundPattern = () => (
  <div className="fixed inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800" />
    <div className="absolute inset-0 opacity-30">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: `radial-gradient(circle, ${
              i % 2 ? 'rgba(168, 85, 247, 0.4)' : 'rgba(236, 72, 153, 0.4)'
            } 0%, transparent 70%)`,
            width: `${Math.random() * 40 + 30}rem`,
            height: `${Math.random() * 40 + 30}rem`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
    <div className="absolute inset-0 bg-grid-small-black/[0.02] dark:bg-grid-small-white/[0.02]" />
  </div>
);

const IndexPage = () => {
  return (
    <div className="flex flex-col h-[89vh] bg-[#F5F6F8]">
      {/* <BackgroundPattern /> */}
      
      <main className="flex-grow container mx-auto px-4 pt-12 pb-0 space-y-8">
        <motion.section 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            Dive into Anonymous Conversations
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Explore WhisperBox - Where your identity remains a secret.
          </p>
          <Link href="/sign-in">
            <Button size="lg" className="text-lg">
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </motion.section>

        <motion.section 
          className="w-full max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 dark:from-purple-600 dark:to-pink-700 p-1 shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <div className="absolute inset-0 bg-white/90 dark:bg-gray-800/90 m-[3px] rounded-lg z-0"></div>
                      <div className="relative z-10 p-5">
                        <h3 className="font-semibold text-lg text-primary mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                          {message.title}
                        </h3>
                        <p className="text-base italic text-gray-600 dark:text-gray-300">
                          "{message.content}"
                        </p>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-500 dark:from-purple-600 dark:to-pink-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </motion.section>

        <motion.section 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start whispering?</h2>
          <p className="text-xl text-muted-foreground mb-6">
            Join our community and experience the thrill of anonymous messaging.
          </p>
          <Link href="/sign-up">
            <Button size="lg" variant="outline" className="text-lg">
              Create Your Profile <MessageCircle className="ml-2" />
            </Button>
          </Link>
        </motion.section>
      </main>

      <footer className="bg-gray-100/80 dark:bg-gray-900/80 py-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 WhisperBox. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default IndexPage;
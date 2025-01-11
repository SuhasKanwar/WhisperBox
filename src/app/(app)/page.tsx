"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

const IndexPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto flex-grow flex flex-col items-center justify-center px-4 py-12 space-y-12">
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
          className="w-full max-w-4xl"
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
                    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardHeader className="font-semibold text-primary">{message.title}</CardHeader>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <p className="text-lg text-center italic">
                          "{message.content}"
                        </p>
                      </CardContent>
                    </Card>
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

      <footer className="bg-gray-100 dark:bg-gray-900 py-6 mt-12">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 WhisperBox. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default IndexPage;
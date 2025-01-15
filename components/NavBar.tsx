"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import { User } from 'next-auth';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { LogOut, Search } from 'lucide-react';
import Image from "next/image";

const NavBar = () => {
    const { data: session } = useSession();
    const user: User = session?.user as User;
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/u/${searchQuery.trim()}`);
        }
    };

    return (
        <nav className="p-4 md:p-6 shadow-md bg-white dark:bg-gray-800">
            <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
                <Link href='/' className="text-2xl font-bold text-primary flex flex-row items-center gap-3">
                    <Image src="/logo.ico" alt="WhisperBox" width={32} height={32} />
                    WhisperBox
                </Link>
                <form onSubmit={handleSearch} className="flex-grow max-w-md mx-4">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pr-10"
                        />
                        <Button 
                            type="submit" 
                            variant="ghost" 
                            size="icon"
                            className="absolute right-0 top-0 h-full"
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                </form>
                <div className="flex items-center space-x-4">
                    {session && (
                        <Link href="/dashboard">
                            <Button variant="ghost">Dashboard</Button>
                        </Link>
                    )}
                    {session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.image || undefined} alt={user.username || user.email || ""} />
                                        <AvatarFallback>{user.username?.[0] || user.email?.[0] || "U"}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.username || user.email}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => signOut()}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href='/sign-in'>
                            <Button>Login</Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
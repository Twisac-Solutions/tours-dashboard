"use client";
import { Bell, ChevronDown, Layout, LogOutIcon, Settings2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/custom/mode-toggle";
import Link from "next/link";
import Image from "next/image";
import { SidebarTrigger } from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// import { useEvent } from "@/providers/EventProvider";
import { Button } from "./ui/button";
import { useSessionStore } from "@/lib/auth";
import { useState } from "react";
import { useProfileStore } from "@/store/useProfileStore";
// import { EventSwitcher } from "./event-switcher";

export default function NavBar() {
  const { signOut } = useSessionStore();
  // const { currentEvent } = useEvent();
  const [open, setOpen] = useState(false);
  const { profile } = useProfileStore();
  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
  };
  return (
    <header className="h-16 border-b flex items-center px-4 justify-between">
      <div className="flex items-center ">
        <SidebarTrigger className="-ml-1" />
        <div className="hidden md:flex mx-4 ">{/* <EventSwitcher /> */}</div>
      </div>
      <div className="flex items-center mx-4 md:hidden justify-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/logo.png"
            alt="G"
            width={100}
            height={100}
            className="h-8 w-8"
          />
          <h2 className="sm:block hidden text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F7B24D] to-[#ED266F]">
            Tours
          </h2>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-4">
          <ModeToggle />
          <div className="relative">
            <Bell className="h-5 w-5 " />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center text-white">
              2
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-accent rounded-2xl p-1">
              <Avatar className="h-8 w-8 border">
                <AvatarImage
                  src={profile?.profile_picture}
                  alt={profile?.name}
                />
                <AvatarFallback>
                  {profile?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col">
                <p className="text-sm font-medium">{profile?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {profile?.email}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[220px] mt-1.5 rounded-xl p-1 shadow-lg bg-background/80 backdrop-blur-sm animate-in fade-in-0 zoom-in-95"
          >
            <DropdownMenuLabel className="px-2 py-2">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {profile?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {profile?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem className="h-9 text-[13px] gap-2 rounded-md">
              <Link href="/profile" className="inline-flex gap-2 w-full">
                <Settings2 className="h-4 w-4 text-muted-foreground" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="h-9 text-[13px] gap-2 rounded-md">
              <Link href="/settings" className="inline-flex gap-2 w-full">
                <Settings2 className="h-4 w-4 text-muted-foreground" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setOpen(true);
              }}
              className="h-9 text-sm gap-2 rounded-md cursor-pointer"
            >
              <LogOutIcon className="h-4 w-4 text-muted-foreground" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will log you out of your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>
              Yes, log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}

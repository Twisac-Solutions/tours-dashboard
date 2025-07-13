"use client";

import { usePathname } from "next/navigation";
import {
  Gift,
  Home,
  List,
  Plus,
  Diamond,
  UserPlus,
  Gamepad2,
  Heart,
  LucideIcon,
  CalendarClock,
  ShoppingBasket,
  LibraryBig,
  BookImage,
  TentTree,
  PlaneIcon,
  Calendar,
  PackageIcon,
  UsersRoundIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
// import { useEvent } from "@/providers/EventProvider";

type SidebarItemType = {
  title: string;
  icon: LucideIcon;
  url: string;
  badge?: string;
  action?: boolean;
};

type SidebarSectionType = {
  title?: string;
  items: SidebarItemType[];
};

export function AppSidebar() {
  const pathname = usePathname();

  const SIDEBAR_DATA: SidebarSectionType[] = [
    {
      items: [
        { title: "Home", icon: Home, url: "/" },
        // { title: "Events", icon: Calendar, url: "/events" },
      ],
    },

    {
      title: "EVENT",
      items: [
        { title: "Tours", icon: TentTree, url: "/tours" },
        {
          title: "Destinations",
          icon: PlaneIcon,
          url: "/destinations",
        },
        { title: "Events", icon: Calendar, url: "/events" },
        { title: "Packages", icon: PackageIcon, url: "/packages" },
        { title: "Users", icon: UsersRoundIcon, url: "/guests", badge: "BETA" },
        // { title: "Bridal Maids & Grooms", icon: Users, url: "#" },
      ],
    },
    {
      title: "MANAGER",
      items: [{ title: "Managers", icon: UserPlus, url: "#", action: true }],
    },
  ];

  return (
    <Sidebar>
      {/* User profile */}
      <SidebarHeader>
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
        {/* <EventSwitcher /> */}
      </SidebarHeader>

      <SidebarContent>
        {SIDEBAR_DATA.map((section, sectionIndex) => (
          <SidebarGroup key={section.title || `section-${sectionIndex}`}>
            {section.title && (
              <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.url ||
                    (pathname.startsWith(item.url) && pathname === item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <div className="flex items-center justify-between w-full">
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={item.url}>
                            <item.icon className="mr-2 h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>

                        {item.badge && (
                          <Badge className="text-[10px] h-4 rounded-sm">
                            {item.badge}
                          </Badge>
                        )}

                        {item.action && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Premium */}
      <SidebarFooter>
        <div className="p-2">
          <div className="flex items-center gap-3 p-3 border rounded-md">
            <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center">
              <Diamond className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <p className="font-medium text-sm">Get Premium</p>
              <p className="text-xs text-muted-foreground">
                Get Premium to create Unlimited Events
              </p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

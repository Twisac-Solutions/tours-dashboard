"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import withAuth from "@/components/with-auth";
import { AppSidebar } from "@/components/app-sidebar";
import NavBar from "@/components/nav-bar";
import { EventProvider } from "@/providers/EventProvider";
import ProfileProvider from "@/providers/ProfileProvider";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <ProfileProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full bg-background">
          <AppSidebar />
          <SidebarInset className="flex flex-col">
            <div className="flex-1">
              <div className="min-h-screen">
                <NavBar />
                <div>{children}</div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ProfileProvider>
  );
};

export default withAuth(DashboardLayout);

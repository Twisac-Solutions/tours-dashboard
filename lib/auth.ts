// store.ts
import { useEventStore } from "@/store/useEventStore";
import { useProfileStore } from "@/store/useProfileStore";
import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/admin";
export const axiosAuth = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  profile_picture?: string;
  role?: string;
}

export interface Session {
  user?: User;
  accessToken: string;
}

interface SessionStore {
  session: Session | null;
  setSession: (session: Session) => void;
  clearSession: () => void;
  isAuthenticated: () => boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  ssoLogin: (token: string) => Promise<void>;
  initiateGoogleLogin: () => void;
  handleGoogleLoginCallback: (code: string) => Promise<void>;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      session: null as Session | null,

      setSession: (session: Session) => {
        set({ session });
      },

      clearSession: () => {
        set({ session: null });
      },

      isAuthenticated: () => {
        const session = get().session;
        return session !== null;
      },

      signIn: async (email: string, password: string) => {
        try {
          const response = await axiosAuth.post("/login", {
            email: email,
            password: password,
          });

          if (response.status === 200) {
            const token = response.data.token;
            const session: Session = {
              accessToken: token,
              user: response.data.user,
            };
            set({ session });
            window.location.href = "/";
          } else {
            console.log(response);
            throw new Error(
              response.data.error || "An error occurred during sign in",
            );
          }
        } catch (error: any) {
          if (error.response && error.response.data) {
            throw new Error(error.response.data.error);
          } else {
            throw new Error("An unknown error occurred");
          }
        }
      },
      ssoLogin: async (token: string) => {
        try {
          if (token) {
            const session: Session = {
              accessToken: token,
            };
            set({ session });
            window.location.href = "/";
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (error) {
          throw new Error("An error occurred during sign in");
        }
      },

      signOut: async () => {
        const session = get().session;
        try {
          if (session) {
            useEventStore.getState().clearEventStore();
            useProfileStore.getState().clearProfile();
            get().clearSession();
          }
        } catch (error) {
          console.error("Error during sign out:", error);
        } finally {
          window.location.href = "/login";
        }
        // try {
        //   axiosAuth.interceptors.request.use(
        //     (config) => {
        //       if (session?.accessToken) {
        //         config.headers[
        //           "Authorization"
        //         ] = `Bearer ${session.accessToken}`;
        //       }
        //       return config;
        //     },
        //     (error) => Promise.reject(error)
        //   );
        //   await axiosAuth.post("/logout/", {
        //     token: session.accessToken,
        //   });
        // } catch (error) {
        //   console.error("Error during sign out:", error);
        // } finally {
        //   get().clearSession();
        // }
      },

      initiateGoogleLogin: () => {
        window.location.href = `${baseURL}/auth/google/login`;
      },

      handleGoogleLoginCallback: async (code: string) => {
        try {
          const response = await axiosAuth.get(`/auth/google/callback`, {
            params: { code },
          });

          const { token } = response.data;

          console.log("Google login callback response:", response);

          window.location.href = "/";
        } catch (error) {
          console.error("Error during Google login callback:", error);
        }
      },
    }),
    {
      name: "session-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

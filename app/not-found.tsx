import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <Image
          src="/assets/404-error-cat.svg"
          alt="404"
          width={400}
          height={400}
          className="mx-auto"
        />
        <h2 className="text-3xl font-semibold text-foreground">
          Page Not Found
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We&quos;re sorry, but the page you are looking for doesn&quos;t exist
          or has been moved.
        </p>
        <Button
          asChild
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}

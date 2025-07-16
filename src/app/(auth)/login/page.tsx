
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Layers className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Synergy HR</h1>
            </div>
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-balance text-muted-foreground">
              Enter your credentials to access your dashboard
            </p>
          </div>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                defaultValue="admin@synergy.com"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline hover:text-primary"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required defaultValue="password" />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline hover:text-primary">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Office Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.3]"
          data-ai-hint="office building professional"
        />
      </div>
    </div>
  );
}

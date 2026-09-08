"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

const getInitial = (user) => {
  if (user.name) return user.name.charAt(0).toUpperCase();
  if (user.email) return user.email.charAt(0).toUpperCase();
  return "U";
};

export default function UserButton({ user }) {
  const router = useRouter();

  if (!user) return null;

  const handleSignOut = () => {
    router.push("/auth/signout");
  };

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-primary/15 text-sm font-semibold text-primary">
          {getInitial(user)}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium text-foreground">{user.name || user.email}</span>
      <button
        type="button"
        onClick={handleSignOut}
        aria-label="Sign out"
        className="btn-ghost h-8 w-8 p-0"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}

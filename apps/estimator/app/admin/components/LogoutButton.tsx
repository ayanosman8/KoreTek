"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@repo/auth/client";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white rounded-lg transition-all font-light text-sm"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  );
}

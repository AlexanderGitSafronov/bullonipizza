"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ShoppingBag,
  LogOut,
  LogIn,
  UserPlus,
  Shield,
  Heart,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/store/auth";
import { useLocale } from "@/i18n/provider";

export function AccountMenu() {
  const { t } = useLocale();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success(t.auth.loggedOut);
    router.push("/");
    router.refresh();
  };

  if (!user) {
    return (
      <Link href="/login" className="hidden sm:inline-flex">
        <Button variant="ghost" size="sm" className="gap-1.5">
          <LogIn className="h-4 w-4" />
          <span className="hidden md:inline">{t.auth.login}</span>
        </Button>
      </Link>
    );
  }

  const initial = (user.name || user.email).charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="account"
          className="h-10 w-10 rounded-full bg-brand-gradient text-white font-bold text-sm flex items-center justify-center shadow-soft"
        >
          {initial}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[220px]">
        <div className="px-3 py-2">
          <p className="text-sm font-semibold truncate">
            {user.name || t.auth.account}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {user.email}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {t.auth.profile}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/orders" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            {t.auth.myOrders}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/favorites" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            {t.nav.favorites}
          </Link>
        </DropdownMenuItem>
        {user.role === "ADMIN" && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              {t.nav.admin}
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-rose-500 focus:text-rose-500"
        >
          <LogOut className="h-4 w-4" />
          {t.auth.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MobileAccountLinks() {
  const { t } = useLocale();
  const { user } = useAuth();
  if (user) return null;
  return (
    <div className="flex gap-2 px-1">
      <Link href="/login" className="flex-1">
        <Button variant="outline" size="sm" className="w-full">
          <LogIn className="h-4 w-4" />
          {t.auth.login}
        </Button>
      </Link>
      <Link href="/register" className="flex-1">
        <Button size="sm" className="w-full">
          <UserPlus className="h-4 w-4" />
          {t.auth.register}
        </Button>
      </Link>
    </div>
  );
}

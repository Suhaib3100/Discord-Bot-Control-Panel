"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Chat', href: '/', icon: MessageSquare },
    { name: 'Management', href: '/management', icon: Shield },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1.5 bg-black/20 backdrop-blur-xl rounded-full border border-white/10 z-50">
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
              pathname === item.href
                ? "bg-white/10 text-white"
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
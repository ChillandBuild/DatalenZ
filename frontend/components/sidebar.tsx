'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Home,
    MessageSquare,
    History,
    Settings,
    LogOut,
    PlusCircle,
    Database
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
    onSignOut: () => void
    onNewSession: () => void
    onHistoryClick: () => void
    onUploadClick: () => void
}

export function Sidebar({
    onSignOut,
    onNewSession,
    onHistoryClick,
    onUploadClick
}: SidebarProps) {
    const pathname = usePathname()

    const navItems = [
        { icon: MessageSquare, label: 'Chat', active: true },
        { icon: Database, label: 'Data', onClick: onUploadClick },
        { icon: History, label: 'History', onClick: onHistoryClick },
    ]

    return (
        <div className="w-16 flex flex-col items-center py-6 bg-white border-r border-gray-200 h-full z-20 shadow-sm">
            {/* Logo */}
            <Link href="/" className="mb-8 group">
                <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-serif font-bold rounded-sm group-hover:scale-110 transition-transform">
                    ∫
                </div>
            </Link>

            {/* Main Nav */}
            <div className="flex-1 flex flex-col gap-4 w-full px-2">
                <button
                    onClick={onNewSession}
                    className="w-full aspect-square flex items-center justify-center rounded-lg bg-gray-100 hover:bg-black hover:text-white transition-colors group"
                    title="New Session"
                >
                    <PlusCircle className="w-5 h-5" />
                </button>

                <div className="w-full h-px bg-gray-100 my-2" />

                {navItems.map((item, i) => (
                    <button
                        key={i}
                        onClick={item.onClick}
                        className={cn(
                            "w-full aspect-square flex items-center justify-center rounded-lg transition-colors",
                            item.active
                                ? "bg-black text-white"
                                : "text-gray-500 hover:bg-gray-100 hover:text-black"
                        )}
                        title={item.label}
                    >
                        <item.icon className="w-5 h-5" />
                    </button>
                ))}
            </div>

            {/* Bottom Nav */}
            <div className="flex flex-col gap-4 w-full px-2">
                <button
                    className="w-full aspect-square flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-black transition-colors"
                    title="Settings"
                >
                    <Settings className="w-5 h-5" />
                </button>
                <button
                    onClick={onSignOut}
                    className="w-full aspect-square flex items-center justify-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Sign Out"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}

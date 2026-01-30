import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "equation" | "graph"
}

export function Skeleton({
    className,
    variant = "default",
    ...props
}: SkeletonProps) {
    if (variant === "equation") {
        return (
            <div className={cn("flex items-center gap-2 animate-pulse", className)} {...props}>
                <div className="h-4 w-8 bg-gray-200 rounded" />
                <div className="h-4 w-4 bg-gray-200 rounded" />
                <div className="h-4 w-12 bg-gray-200 rounded" />
                <div className="h-4 w-4 bg-gray-200 rounded" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
        )
    }

    if (variant === "graph") {
        return (
            <div className={cn("relative overflow-hidden rounded-md border border-dashed border-gray-200 bg-gray-50/50 p-4", className)} {...props}>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-full w-full opacity-10"
                        style={{
                            backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }}
                    />
                </div>
                <div className="h-full w-full flex items-end justify-between gap-2 px-4 pb-4">
                    {[40, 70, 50, 80, 60, 90, 30].map((h, i) => (
                        <div
                            key={i}
                            className="w-full bg-gray-200 rounded-t-sm animate-pulse"
                            style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                        />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div
            className={cn("animate-pulse rounded-md bg-gray-100", className)}
            {...props}
        />
    )
}

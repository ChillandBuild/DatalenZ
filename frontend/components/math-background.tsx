'use client'

import { useEffect, useState } from 'react'

export function MathBackground() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    // Mathematical symbols to float in the background
    const symbols = ['∫', '∑', '∏', '∂', '∇', '∆', 'π', '∞', '√', 'ƒ', 'λ', 'θ', 'Ω', 'μ']

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-white">
            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Floating Symbols */}
            {symbols.map((symbol, i) => (
                <div
                    key={i}
                    className="absolute text-black font-serif select-none animate-float"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        fontSize: `${Math.random() * 40 + 20}px`,
                        opacity: Math.random() * 0.05 + 0.01, // Very subtle opacity (1-6%)
                        animationDuration: `${Math.random() * 20 + 20}s`,
                        animationDelay: `${Math.random() * 10}s`,
                        transform: `rotate(${Math.random() * 360}deg)`
                    }}
                >
                    {symbol}
                </div>
            ))}
        </div>
    )
}

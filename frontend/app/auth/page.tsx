'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { LoginForm } from '@/components/auth/login-form'
import { SignupForm } from '@/components/auth/signup-form'
import { MathBackground } from '@/components/math-background'
import Link from 'next/link'

function AuthContent() {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <MathBackground />

      <div className="max-w-md w-full p-8 bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Link href="/" className="text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1">
              ← Back to Home
            </Link>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-serif font-bold rounded-sm group-hover:scale-110 transition-transform">
              ∫
            </div>
            <span className="font-semibold text-lg tracking-tight">DataLen<span className="font-serif">ℤ</span></span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === 'login' ? 'Welcome back' : 'Start analyzing'}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {mode === 'login' ? 'Enter your credentials to access your workspace' : 'Create an account to unlock transparent AI analysis'}
          </p>
        </div>

        {mode === 'login' ? <LoginForm /> : <SignupForm />}

        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-sm text-gray-600 hover:text-black transition-colors underline underline-offset-4"
          >
            {mode === 'login'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  )
}

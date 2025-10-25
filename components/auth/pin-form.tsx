'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Shield } from 'lucide-react'

interface PinFormProps {
  onSuccess: () => void
  onBack?: () => void
}

export function PinForm({ onSuccess, onBack }: PinFormProps) {
  const { loginWithPin, isLoading } = useAuth()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handlePinChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return

    const newPin = pin.split('')
    newPin[index] = value
    const newPinString = newPin.join('').slice(0, 4)
    setPin(newPinString)

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when PIN is complete
    if (newPinString.length === 4) {
      handleSubmit(newPinString)
    }

    if (error) setError('')
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (pinValue?: string) => {
    const pinToSubmit = pinValue || pin
    if (pinToSubmit.length !== 4) return

    setError('')
    setIsSubmitting(true)

    try {
      const result = await loginWithPin(pinToSubmit)
      
      if (result.success) {
        onSuccess()
      } else {
        setError(result.message)
        setPin('')
        inputRefs.current[0]?.focus()
      }
    } catch (error) {
      setError('An unexpected error occurred')
      setPin('')
      inputRefs.current[0]?.focus()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    
    if (pastedData.length === 4) {
      setPin(pastedData)
      handleSubmit(pastedData)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* PIN Input */}
      <div className="space-y-4">
        <div className="flex justify-center space-x-3">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={pin[index] || ''}
              onChange={(e) => handlePinChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-12 text-center text-2xl font-bold border-2 border-input rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-50"
              disabled={isSubmitting}
            />
          ))}
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Enter your 4-digit PIN
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        onClick={() => handleSubmit()}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        disabled={pin.length !== 4 || isSubmitting || isLoading}
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
            <span>Verifying PIN...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Verify PIN</span>
          </div>
        )}
      </Button>

      {/* Back Button (optional) */}
      {onBack && (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="w-full"
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Button>
      )}
    </div>
  )
}

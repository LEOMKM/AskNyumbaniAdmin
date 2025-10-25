'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Check } from 'lucide-react'

interface CreatePinFormProps {
  onSuccess: () => void
}

export function CreatePinForm({ onSuccess }: CreatePinFormProps) {
  const { createPin, isLoading } = useAuth()
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const pinInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const confirmPinInputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus first input on mount
    if (pinInputRefs.current[0]) {
      pinInputRefs.current[0].focus()
    }
  }, [])

  const handlePinChange = (index: number, value: string, isConfirm = false) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return

    const targetPin = isConfirm ? confirmPin : pin
    const newPin = targetPin.split('')
    newPin[index] = value
    const newPinString = newPin.join('').slice(0, 4)
    
    if (isConfirm) {
      setConfirmPin(newPinString)
    } else {
      setPin(newPinString)
    }

    // Auto-focus next input
    if (value && index < 3) {
      const refs = isConfirm ? confirmPinInputRefs : pinInputRefs
      refs.current[index + 1]?.focus()
    }

    if (error) setError('')
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent, isConfirm = false) => {
    // Handle backspace
    if (e.key === 'Backspace' && !(isConfirm ? confirmPin : pin)[index] && index > 0) {
      const refs = isConfirm ? confirmPinInputRefs : pinInputRefs
      refs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async () => {
    if (pin.length !== 4) {
      setError('Please enter a 4-digit PIN')
      return
    }

    if (confirmPin.length !== 4) {
      setError('Please confirm your PIN')
      return
    }

    if (pin !== confirmPin) {
      setError('PINs do not match')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const result = await createPin(pin)
      
      if (result.success) {
        onSuccess()
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaste = (e: React.ClipboardEvent, isConfirm = false) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    
    if (pastedData.length === 4) {
      if (isConfirm) {
        setConfirmPin(pastedData)
      } else {
        setPin(pastedData)
      }
    }
  }

  const isFormValid = pin.length === 4 && confirmPin.length === 4 && pin === confirmPin

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* PIN Input */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Create 4-digit PIN
          </label>
          <div className="flex justify-center space-x-3">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                ref={(el) => (pinInputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={pin[index] || ''}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={(e) => handlePaste(e)}
                className="w-12 h-12 text-center text-2xl font-bold border-2 border-input rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-50"
                disabled={isSubmitting}
              />
            ))}
          </div>
        </div>

        {/* Confirm PIN Input */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Confirm PIN
          </label>
          <div className="flex justify-center space-x-3">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                ref={(el) => (confirmPinInputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={confirmPin[index] || ''}
                onChange={(e) => handlePinChange(index, e.target.value, true)}
                onKeyDown={(e) => handleKeyDown(index, e, true)}
                onPaste={(e) => handlePaste(e, true)}
                className="w-12 h-12 text-center text-2xl font-bold border-2 border-input rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-50"
                disabled={isSubmitting}
              />
            ))}
          </div>
        </div>
      </div>

      {/* PIN Requirements */}
      <div className="text-sm text-muted-foreground space-y-1">
        <p>PIN Requirements:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Must be exactly 4 digits</li>
          <li>Use numbers only (0-9)</li>
          <li>Choose something memorable but secure</li>
        </ul>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        disabled={!isFormValid || isSubmitting || isLoading}
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
            <span>Creating PIN...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Check className="h-4 w-4" />
            <span>Create PIN & Continue</span>
          </div>
        )}
      </Button>
    </div>
  )
}

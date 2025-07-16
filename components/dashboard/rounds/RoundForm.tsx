  'use client'

  import React, { useState } from 'react'
  import { useForm } from 'react-hook-form'
  import { zodResolver } from '@hookform/resolvers/zod'
  import { z } from 'zod'
  import { X, Trophy } from 'lucide-react'
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { toast } from 'sonner'
  import { useCreateRounds, useUpdateRounds } from '../api/useRound'  

  // Zod validation schema
  const roundSchema = z.object({
    name: z
      .string()
      .min(3, 'Round name must be at least 3 characters')
      .max(50, 'Round name must be less than 50 characters')
      .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Round name can only contain letters, numbers, spaces, hyphens, and underscores'),
    numberOfMatches: z.coerce.number({
      invalid_type_error: 'Please enter a valid number of matches',
      required_error: 'Number of matches is required',
    }),
  })

  type RoundFormData = z.infer<typeof roundSchema>

  type FormProps = {
    opened: boolean
    onClose?: () => void
    onSubmit?: (data: RoundFormData) => void
    type: 'create' | 'edit'
    initialData?: any
    tournmentId: string
  }

  const RoundForm = ({ opened, onClose, onSubmit, type, initialData, tournmentId }: FormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
      register,
      handleSubmit,
      formState: { errors, isValid },
      reset,
      setValue,
      watch
    } = useForm<RoundFormData>({
      resolver: zodResolver(roundSchema),
      mode: 'onChange',
      defaultValues: initialData || {
        name: '',
        numberOfMatches: 0,
      },
      
    })

    React.useEffect(() => {
      if (initialData) {
        reset({ ...initialData })
      } else {
        reset({
          name: '',
          numberOfMatches: 0,
        })
      }
    }, [initialData, reset])

  

    const {mutate ,isPending}=type === 'edit' ? useUpdateRounds() : useCreateRounds()

    const onFormSubmit = async (data: RoundFormData) => {


      setIsSubmitting(true)
      
      try {
        // Simulate API call - replace with your actual API call
        
        const formData = {
          ...data,
          ...(type === 'edit' && initialData?.id ? { id: initialData.id } : {}),
          tournamentId: tournmentId,
        }
        
        console.log('Round created:', formData)
        mutate(formData)
        
        // Reset form
        reset()
        onClose?.()

        toast.success(
          type === 'edit' ? "Round updated successfully" : "Round created successfully",
        )
      } catch (error) {
        console.error('Error creating round:', error)
        toast.error(
        type === 'edit' ? "Failed to update round" : "Failed to create round",
        )
      } finally {
        setIsSubmitting(false)
      }
    }

    const handleClose = () => {
      reset()
      onClose?.()
    }

    return (
      <Dialog open={opened} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <DialogContent className="sm:max-w-2xl max-w-[95vw] rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <Trophy className="h-6 w-6 text-primary-foreground" />
              </div>
              <span>{type === 'edit' ? 'Edit Round' : 'Create New Round'}</span>
            </DialogTitle>
            <DialogDescription>
              {type === 'edit' ? 'Update the details below to edit the round.' : 'Fill in the details below to create a new round.'}
            </DialogDescription>
          </DialogHeader>



          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="grid grid-cols-1 gap-6">
              {/* Tournament Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Round Name</Label>
                <Input
                  {...register('name')}
                  type="text"
                  id="name"
                  placeholder="Enter round name"
                  className="bg-transparent"
                />
                {errors.name && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Primary Color */}
                <div className="space-y-2">
                  <Label htmlFor="numberOfMatches">Matches</Label>
                  <Input
                    {...register('numberOfMatches', { valueAsNumber: true })}
                    type="number"
                    id="numberOfMatches"
                    placeholder="Number of matches"
                    className="bg-transparent"
                  />
                  {errors.numberOfMatches && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.numberOfMatches.message}
                    </p>
                  )}
                </div>


            

              
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 justify-end mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 sm:flex-none sm:max-w-xs order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValid  || isSubmitting}
                className="flex-1 sm:flex-none sm:max-w-xs order-1 sm:order-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">↻</span>
                    {type === 'edit' ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                    type === 'edit' ? 'Update Round' : 'Create Round'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  export default RoundForm
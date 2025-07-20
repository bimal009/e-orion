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
  import { useCreateRound, useUpdateRound } from '../api/useRound'  


  // Zod validation schema
  const gameSchema = z.object({
    name: z
      .string()
      .min(3, 'Round name must be at least 3 characters')
      .max(50, 'Round name must be less than 50 characters')
      .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Round name can only contain letters, numbers, spaces, hyphens, and underscores'),
    
    numberOfDays: z.coerce.number({
      invalid_type_error: 'Please enter a valid number of days',
      required_error: 'Number of days is required',
    }),
    
  })

  type GameFormData = z.infer<typeof gameSchema>

  type GameFormProps = {
    opened: boolean
    onClose?: () => void
    onSubmit?: (data: GameFormData) => void
    type: 'create' | 'edit'
    initialData?: any
    tournmentId: string
  }

  const GameForm = ({ opened, onClose, onSubmit, type, initialData, tournmentId }: GameFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isImageUploading, setIsImageUploading] = useState(false)

    const {
      register,
      handleSubmit,
      formState: { errors, isValid },
      reset,
      setValue,
      watch
    } = useForm<GameFormData>({
      resolver: zodResolver(gameSchema),
      mode: 'onChange',
      defaultValues: initialData || {
        name: '',
        numberOfDays: 0,
      },
      
    })

    React.useEffect(() => {
      if (initialData) {
        reset({ ...initialData })
      } else {
        reset({
          name: '',
          numberOfDays: 0,
          })
      }
    }, [initialData, reset])

  

    const {mutate ,isPending}=type === 'edit' ? useUpdateRound() : useCreateRound()

    const onFormSubmit = async (data: GameFormData) => {


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
              <span className="text-foreground">{type === 'edit' ? 'Edit Round' : 'Create New Round'}</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {type === 'edit' ? 'Update the details below to edit the round.' : 'Fill in the details below to create a new round.'}
            </DialogDescription>
          </DialogHeader>



          {/* Example image upload field for round (add or remove as needed) */}
          {/* <CloudinaryUploader
            onImageUpload={url => setValue('logo', url, { shouldValidate: true })}
            previewImage={watch('logo') || null}
            onUploadingChange={setIsImageUploading}
            aspectRatio="rectangle"
            placeholderText="Upload Round Image"
          /> */}

          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="grid grid-cols-1 gap-6">
              {/* Tournament Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Round Name</Label>
                <Input
                  {...register('name')}
                  type="text"
                  id="name"
                  placeholder="Enter round name"
                  className="bg-background"
                />
                {errors.name && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

             
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Number of Days */}
                <div className="space-y-2">
                  <Label htmlFor="numberOfDays" className="text-foreground">Days</Label>
                  <Input
                    {...register('numberOfDays', { valueAsNumber: true })}
                    type="number"
                    id="numberOfDays"
                    placeholder="Number of days"
                    className="bg-background"
                  />
                  {errors.numberOfDays && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.numberOfDays.message}
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
                disabled={!isValid || isSubmitting || isImageUploading}
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

  export default GameForm
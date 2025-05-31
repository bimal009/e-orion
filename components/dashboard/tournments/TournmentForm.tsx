'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Trophy } from 'lucide-react'
import CloudinaryUploader from './CloudnaryUploader'
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
import { useCreateTournaments } from '../api/UseTournment'

// Zod validation schema
const tournamentSchema = z.object({
  name: z
    .string()
    .min(3, 'Tournament name must be at least 3 characters')
    .max(50, 'Tournament name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Tournament name can only contain letters, numbers, spaces, hyphens, and underscores'),
  logo: z
    .string()
    .url('Please upload a valid logo image')
    .optional()
    .or(z.literal('')),
    ownerId:z.string()

})

type TournamentFormData = z.infer<typeof tournamentSchema>

type FormProps = {
  opened: boolean
  onClose?: () => void
  onSubmit?: (data: TournamentFormData & { logo: string }) => void
}

const TournamentForm = ({ opened, onClose, onSubmit }: FormProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch
  } = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      logo: '',
      ownerId:""
    }
  })

  const handleImageUpload = (url: string) => {
    setImageUrl(url)
    setValue('logo', url, { shouldValidate: true })


  }

  const {mutate ,isPending}=useCreateTournaments()

  const onFormSubmit = async (data: TournamentFormData) => {
    if (!imageUrl) {
      toast.error(
       "Please upload a tournament logo",
    
      )
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call - replace with your actual API call
      
      const formData = {
        ...data,
        logo: imageUrl
      }
      
      console.log('Tournament created:', formData)
      mutate(formData)
      
      // Reset form
      reset()
      setImageUrl(null)
      onClose?.()

      toast.success(
        "Tournament created successfully",
      )
    } catch (error) {
      console.error('Error creating tournament:', error)
      toast.error(
       "Failed to create tournament",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    setImageUrl(null)
    onClose?.()
  }

  return (
    <Dialog open={opened} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <span>Create Tournament</span>
          </DialogTitle>
          <DialogDescription>
            Fill in the details to create a new tournament
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Tournament Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Tournament Name</Label>
            <Input
              {...register('name')}
              type="text"
              id="name"
              placeholder="Enter tournament name"
              className="bg-black"
            />
            {errors.name && (
              <p className="text-sm font-medium text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Tournament Logo */}
          <div className="space-y-2">
            <Label>Tournament Logo</Label>
            <CloudinaryUploader
              onImageUpload={handleImageUpload}
              previewImage={imageUrl}
              placeholderText="Upload Tournament Logo"
              aspectRatio="rectangle"
              className="border-2 border-dashed bg-black rounded-lg hover:border-primary transition-colors"
            />
            {!imageUrl && (
              <p className="text-sm font-medium text-destructive">
                Please upload a tournament logo
              </p>
            )}
          </div>

          {/* Form Status */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {watch('name')?.length || 0}/50 characters
            </span>
          
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(onFormSubmit)}
            disabled={!isValid || !imageUrl || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">↻</span>
                Creating...
              </>
            ) : (
              'Create Tournament'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TournamentForm
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
import { useCreateTournaments, useUpdateTournaments } from '../api/UseTournment'

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
  ownerId: z.string(),
  primaryColor: z.string().min(1, 'Primary color is required'),
  secondaryColor: z.string().min(1, 'Secondary color is required'),
  textColor1: z.string().min(1, 'Text color 1 is required'),
  textColor2: z.string().min(1, 'Text color 2 is required'),
})

type TournamentFormData = z.infer<typeof tournamentSchema>

type FormProps = {
  opened: boolean
  onClose?: () => void
  onSubmit?: (data: TournamentFormData & { logo: string }) => void
  type: 'create' | 'edit'
  initialData?: any
}

const TournamentForm = ({ opened, onClose, onSubmit, type, initialData }: FormProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.logo || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Keep track of the original image URL for edit mode
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(initialData?.logo || null)

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
    defaultValues: initialData || {
      name: '',
      logo: '',
      ownerId: '',
      primaryColor: '',
      secondaryColor: '',
      textColor1: '',
      textColor2: '',
    }
  })

  React.useEffect(() => {
    if (initialData) {
      reset({ ...initialData })
      setImageUrl(initialData.logo || null)
      setOriginalImageUrl(initialData.logo || null)
    } else {
      reset({
        name: '',
        logo: '',
        ownerId: '',  
        primaryColor: '',
        secondaryColor: '',
        textColor1: '',
        textColor2: '',
      })
      setImageUrl(null)
      setOriginalImageUrl(null)
    }
  }, [initialData, reset])

  const handleImageUpload = (url: string) => {
    setImageUrl(url)
    setValue('logo', url, { shouldValidate: true })
  }

  const {mutate ,isPending}=type === 'edit' ? useUpdateTournaments() : useCreateTournaments()

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
        logo: imageUrl,
        primaryColor: data.primaryColor || "",
        secondaryColor: data.secondaryColor || "",
        textColor1: data.textColor1 || "",
        textColor2: data.textColor2 || "",
        ...(type === 'edit' && initialData?.id ? { id: initialData.id } : {}),
      }
      
      console.log('Tournament created:', formData)
      mutate(formData)
      
      // Reset form
      reset()
      setImageUrl(null)
      setOriginalImageUrl(null)
      onClose?.()

      toast.success(
        type === 'edit' ? "Tournament updated successfully" : "Tournament created successfully",
      )
    } catch (error) {
      console.error('Error creating tournament:', error)
      toast.error(
       type === 'edit' ? "Failed to update tournament" : "Failed to create tournament",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    // Restore original image URL if in edit mode
    if (type === 'edit' && originalImageUrl) {
      setImageUrl(originalImageUrl)
    } else {
      setImageUrl(null)
    }
    reset()
    onClose?.()
  }

  return (
    <Dialog open={opened} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-w-[95vw] rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Trophy className="h-6 w-6 text-primary-foreground" />
            </div>
            <span>{type === 'edit' ? 'Edit Tournament' : 'Create New Tournament'}</span>
          </DialogTitle>
          <DialogDescription>
            {type === 'edit' ? 'Update the details below to edit the tournament.' : 'Fill in the details below to create a new tournament.'}
          </DialogDescription>
        </DialogHeader>

        {/* Tournament Banner */}
        <div className="mb-6">
          <Label className="mb-2 block">{type === 'edit' ? 'Change Image' : 'Tournament Banner'}</Label>
          <CloudinaryUploader
            onImageUpload={handleImageUpload}
            previewImage={imageUrl}
            placeholderText={type === 'edit' ? 'Change image' : 'Drop your image here, or browse'}
            aspectRatio="rectangle"
            className="border-2 border-dashed rounded-lg hover:border-primary transition-colors w-full min-h-[220px] flex items-center justify-center"
          />
          {!imageUrl && (
            <p className="text-sm font-medium text-destructive mt-2">
              Please upload a tournament logo
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="grid grid-cols-1 gap-6">
            {/* Tournament Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Tournament Name</Label>
              <Input
                {...register('name')}
                type="text"
                id="name"
                placeholder="Enter tournament name"
                className="bg-transparent"
              />
              {errors.name && (
                <p className="text-sm font-medium text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Color Pickers Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Primary Color */}
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    {...register('primaryColor')}
                    id="primaryColor"
                    className="w-10 h-10 p-0 rounded  flex-shrink-0"
                    value={watch('primaryColor')}
                    onChange={e => setValue('primaryColor', e.target.value, { shouldValidate: true })}
                  />
                  <Input
                    {...register('primaryColor')}
                    type="text"
                    placeholder="#000000"
                    className="bg-transparent flex-1 min-w-0"
                  />
                </div>
                {errors.primaryColor && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.primaryColor.message}
                  </p>
                )}
              </div>

              {/* Secondary Color */}
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    {...register('secondaryColor')}
                    id="secondaryColor"
                    className="w-10 h-10 p-0 rounded  flex-shrink-0"
                    value={watch('secondaryColor')}
                    onChange={e => setValue('secondaryColor', e.target.value, { shouldValidate: true })}
                  />
                  <Input
                    {...register('secondaryColor')}
                    type="text"
                    placeholder="#ffffff"
                    className="bg-transparent flex-1 min-w-0"
                  />
                </div>
                {errors.secondaryColor && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.secondaryColor.message}
                  </p>
                )}
              </div>

              {/* Text Color 1 */}
              <div className="space-y-2">
                <Label htmlFor="textColor1">Text Color 1</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    {...register('textColor1')}
                    id="textColor1"
                    className="w-10 h-10 p-0 rounded  flex-shrink-0"
                    value={watch('textColor1')}
                    onChange={e => setValue('textColor1', e.target.value, { shouldValidate: true })}
                  />
                  <Input
                    {...register('textColor1')}
                    type="text"
                    placeholder="#000000"
                    className="bg-transparent flex-1 min-w-0"
                  />
                </div>
                {errors.textColor1 && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.textColor1.message}
                  </p>
                )}
              </div>

              {/* Text Color 2 */}
              <div className="space-y-2">
                <Label htmlFor="textColor2">Text Color 2</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    {...register('textColor2')}
                    id="textColor2"
                    className="w-10 h-10 p-0 rounded  flex-shrink-0"
                    value={watch('textColor2')}
                    onChange={e => setValue('textColor2', e.target.value, { shouldValidate: true })}
                  />
                  <Input
                    {...register('textColor2')}
                    type="text"
                    placeholder="#ffffff"
                    className="bg-transparent flex-1 min-w-0"
                  />
                </div>
                {errors.textColor2 && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.textColor2.message}
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
              disabled={!isValid || !imageUrl || isSubmitting}
              className="flex-1 sm:flex-none sm:max-w-xs order-1 sm:order-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">↻</span>
                  {type === 'edit' ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                type === 'edit' ? 'Update Tournament' : 'Create Tournament'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default TournamentForm
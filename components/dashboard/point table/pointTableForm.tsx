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
  import { useCreatePointTable, useUpdatePointTable } from '../api/usePointsTable'  
  import { useFieldArray, Controller } from 'react-hook-form'


  // Zod validation schema
  const pointTableSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    ranks: z.array(
      z.object({
        rank: z.coerce.number({
          invalid_type_error: 'Please enter a valid rank',
          required_error: 'Rank is required',
        }),
        placementPoint: z.coerce.number({
          invalid_type_error: 'Please enter a valid placement point',
          required_error: 'Placement point is required',
        })
      })
    ).min(1, 'At least one rank is required'),
    killPoint: z.coerce.number({
      invalid_type_error: 'Please enter a valid kill point',
      required_error: 'Kill point is required',
    })
  })

  type PointTableFormData = z.infer<typeof pointTableSchema>

  type FormProps = {
    opened: boolean
    onClose?: () => void
    onSubmit?: (data: PointTableFormData) => void
    type: 'create' | 'edit'
    initialData?: any
    tournmentId: string
  }

  const PointTableForm = ({ opened, onClose, onSubmit, type, initialData, tournmentId }: FormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isImageUploading, setIsImageUploading] = useState(false)

    const {
      register,
      handleSubmit,
      formState: { errors, isValid },
      reset,
      control
    } = useForm<PointTableFormData>({
      resolver: zodResolver(pointTableSchema),
      mode: 'onChange',
      defaultValues: initialData || {
        name: '',
        ranks: [{ rank: 1, placementPoint: 0 }],
        killPoint: 0,
      },
      
    })

    const { fields, append, remove } = useFieldArray({
      control,
      name: 'ranks',
    })

    React.useEffect(() => {
      if (initialData) {
        reset({ ...initialData })
      } else {
        reset({
          name: '',
          ranks: [{ rank: 1, placementPoint: 0 }],
          killPoint: 0,
        })
      }
    }, [initialData, reset])

  

    const createMutation = useCreatePointTable();
    const updateMutation = useUpdatePointTable();

    const onFormSubmit = async (data: PointTableFormData) => {
      setIsSubmitting(true)
      try {
        if (type === 'edit') {
          if (!initialData?.id) {
            toast.error('Missing ID for update')
            setIsSubmitting(false)
            return
          }
          updateMutation.mutate({ ...data, id: initialData.id, tournamentId: tournmentId, pointTableName: data.name })
        } else {
          createMutation.mutate({ ...data, tournamentId: tournmentId, pointTableName: data.name })
        }
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
              <span className="text-foreground">{type === 'edit' ? 'Edit Point Table' : 'Create Point Table'}</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {type === 'edit' ? 'Update the details below to edit the point table.' : 'Fill in the details below to create a new point table.'}
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
              {/* Name Field */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Name</Label>
                  <Input
                    {...register('name')}
                    id="name"
                    placeholder="Point Table Name"
                    className="bg-background"
                  />
                  {errors.name && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Kill Point */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="killPoint" className="text-foreground">Kill Point</Label>
                  <Input
                    {...register('killPoint', { valueAsNumber: true })}
                    type="number"
                    id="killPoint"
                    placeholder="Kill point value"
                    className="bg-background"
                  />
                  {errors.killPoint && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.killPoint.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Dynamic Ranks */}
              <div className="space-y-2">
                <Label className="text-foreground">Rank & Placement Points</Label>
                <div className="flex flex-col gap-2">
                  {fields.map((field, idx) => (
                    <div key={field.id} className="flex gap-2 items-center">
                      <Input
                        {...register(`ranks.${idx}.rank` as const, { valueAsNumber: true })}
                        type="number"
                        placeholder="Rank"
                        className="bg-background w-24"
                      />
                      <Input
                        {...register(`ranks.${idx}.placementPoint` as const, { valueAsNumber: true })}
                        type="number"
                        placeholder="Placement Point"
                        className="bg-background w-36"
                      />
                      <Button type="button" variant="destructive" onClick={() => remove(idx)} disabled={fields.length === 1}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="secondary" onClick={() => append({ rank: fields.length + 1, placementPoint: 0 })}>
                    + Add Rank
                  </Button>
                </div>
                {errors.ranks && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.ranks.message as string}
                  </p>
                )}
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
                    type === 'edit' ? 'Update Point Table' : 'Create Point Table'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  export default PointTableForm
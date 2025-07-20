'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Trophy, Users, Shuffle } from 'lucide-react'
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
import { Separator } from '@/components/ui/separator'
import { useGetTeams } from '../api/useTeams'
import { useCreateGroup, useUpdateGroup } from '../api/useGroup'


// Zod validation schema
const groupSchema = z.object({
  name: z
    .string()
    .min(3, 'Group name must be at least 3 characters')
    .max(50, 'Group name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Group name can only contain letters, numbers, spaces, hyphens, and underscores'),
  

  teams: z.array(z.string()).min(1, 'Select at least one team'),
})

type GroupFormData = z.infer<typeof groupSchema>

type GroupFormProps = {
  opened: boolean
  onClose?: () => void
  onSubmit?: (data: GroupFormData) => void
  type: 'create' | 'edit'
  initialData?: any
  tournmentId: string
  roundId: string
}

const GroupForm = ({ opened, onClose,  onSubmit, type, initialData, tournmentId, roundId }: GroupFormProps) => {
  console.log(roundId, "roundId")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [randomTeamCount, setRandomTeamCount] = useState<number>(1)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    mode: 'onChange',
    defaultValues: initialData || {
      name: '',
      teams: [],
    },
    
  })

  const { data: teamsData, isPending: teamsLoading } = useGetTeams(tournmentId)
  const selectedTeams = watch('teams')

  // In edit mode, show all teams. In create mode, only show unselected teams
  const displayTeams = type === 'edit' ? teamsData : teamsData?.filter((team:any)=>team.isSelected===false)

  React.useEffect(() => {
    if (initialData) {
      reset({ ...initialData, teams: initialData.teams?.map((t:any) => t.id) || [] })
    } else {
      reset({
        name: '',
        
        teams: [],
        })
    }
  }, [initialData, reset])

  const {mutate ,isPending}=type === 'edit' ? useUpdateGroup() : useCreateGroup()

  const onFormSubmit = async (data: GroupFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call - replace with your actual API call
      
      const formData = {
        ...data,
        ...(type === 'edit' && initialData?.id ? { id: initialData.id } : {}),
        tournamentId: tournmentId,
        roundId: roundId,
        teams: data.teams.map((teamId: string) => {
          const team = teamsData?.find((t: any) => t.id === teamId)
          return {
            id: teamId,
            name: team?.name || '',
            tournamentId: tournmentId,
            teamTag: team?.teamTag || undefined,
            logo: team?.logo || undefined,
            email: team?.email || undefined,
            phone: team?.phone || undefined,
          }
        }), 
      }
      
      console.log('Group created:', formData)
      mutate(formData )
      
      // Reset form
      reset()
      onClose?.()

      toast.success(
        type === 'edit' ? "Group updated successfully" : "Group created successfully",
      )
    } catch (error) {
      console.error('Error creating group:', error)
      toast.error(
      type === 'edit' ? "Failed to update group" : "Failed to create group",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose?.()
  }

  const handleSelectAllTeams = () => {
    if (displayTeams) {
      const allTeamIds = displayTeams.map((team: any) => team.id)
      setValue('teams', allTeamIds, { shouldValidate: true })
    }
  }

  const handleDeselectAllTeams = () => {
    setValue('teams', [], { shouldValidate: true })
  }

  const handleRandomTeamSelection = () => {
    if (displayTeams && randomTeamCount > 0) {
      // In edit mode, we can select from all teams. In create mode, only from unselected teams
      const availableTeams = type === 'edit' 
        ? displayTeams.filter((team: any) => !selectedTeams?.includes(team.id))
        : displayTeams
      
      const maxCount = Math.min(randomTeamCount, availableTeams.length)
      
      if (maxCount === 0) {
        toast.error('No available teams to select randomly')
        return
      }

      // Shuffle available teams and select the specified number
      const shuffled = [...availableTeams].sort(() => Math.random() - 0.5)
      const randomlySelected = shuffled.slice(0, maxCount).map((team: any) => team.id)
      
      // Add to existing selection
      const currentTeams = selectedTeams || []
      const newTeams = [...new Set([...currentTeams, ...randomlySelected])]
      
      setValue('teams', newTeams, { shouldValidate: true })
      toast.success(`Randomly selected ${maxCount} team${maxCount > 1 ? 's' : ''}`)
    } else if (randomTeamCount === 0) {
      toast.error('Please enter a number greater than 0')
    }
  }

  return (
    <Dialog open={opened} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="sm:max-w-4xl max-w-[95vw] rounded-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Trophy className="h-6 w-6 text-primary-foreground" />
            </div>
            <span>{type === 'edit' ? 'Edit Group' : 'Create New Group'}</span>
          </DialogTitle>
          <DialogDescription>
            {type === 'edit' ? 'Update the details below to edit the group.' : 'Fill in the details below to create a new group.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-6 p-1">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
                
                {/* Group Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Group Name</Label>
                  <Input
                    {...register('name')}
                    type="text"
                    id="name"
                    placeholder="Enter group name"
                    className="bg-background"
                  />
                  {errors.name && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

               
                 
              </div>

              <Separator />

              {/* Random Team Selection Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shuffle className="h-5 w-5 text-foreground" />
                  <h3 className="text-lg font-semibold text-foreground">Random Team Selection</h3>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="randomCount" className="text-sm">Number of teams:</Label>
                    <Input
                      type="number"
                      id="randomCount"
                      min="0"
                      max={displayTeams?.length}
                      value={randomTeamCount === 0 ? '' : randomTeamCount}
                      onChange={(e) => {
                        if (e.target.value === '') {
                          setRandomTeamCount(0)
                        } else {
                          const value = parseInt(e.target.value) || 0
                          setRandomTeamCount(Math.max(0, value))
                        }
                      }}
                      className="w-20 bg-background"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRandomTeamSelection}
                    disabled={!displayTeams || displayTeams.length === 0}
                    className="flex items-center gap-2"
                  >
                    <Shuffle className="h-4 w-4" />
                    Select Randomly
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {type === 'edit' 
                    ? 'This will randomly select teams from all available teams and add them to your current selection.'
                    : 'This will randomly select teams from the available unselected teams and add them to your current selection.'
                  }
                </p>
                
                {randomTeamCount > 0 && displayTeams && randomTeamCount > displayTeams.length && (
                  <div className="flex items-center gap-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      Warning: You requested {randomTeamCount} teams but only {displayTeams.length} are available. 
                      Only {displayTeams.length} teams will be selected.
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Teams Selection Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-foreground" />
                    <h3 className="text-lg font-semibold text-foreground">Select Teams</h3>
                    {selectedTeams && selectedTeams.length > 0 && (
                      <span className="bg-accent text-foreground px-2 py-1 rounded-full text-xs">
                        {selectedTeams.length} selected
                      </span>
                    )}
                  </div>
                  
                  {displayTeams && displayTeams.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAllTeams}
                        className="text-xs"
                      >
                        Select All
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleDeselectAllTeams}
                        className="text-xs"
                      >
                        Clear All
                      </Button>
                    </div>
                  )}
                </div>

                {teamsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin mr-2">↻</div>
                    <span className="text-muted-foreground">Loading teams...</span>
                  </div>
                ) : displayTeams && displayTeams.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {displayTeams.map((team: any) => (
                      <label 
                        key={team.id} 
                        className={`
                          flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all hover:bg-accent
                          ${selectedTeams?.includes(team.id) ? 'border-primary bg-accent' : 'border-border'}
                        `}
                      >
                        <input
                          type="checkbox"
                          value={team.id}
                          checked={selectedTeams?.includes(team.id)}
                          onChange={e => {
                            const checked = e.target.checked
                            let newTeams = selectedTeams ? [...selectedTeams] : []
                            if (checked) {
                              newTeams.push(team.id)
                            } else {
                              newTeams = newTeams.filter((id: string) => id !== team.id)
                            }
                            setValue('teams', newTeams, { shouldValidate: true })
                          }}
                          className="accent-primary w-4 h-4"
                        />
                        
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {team.logo && (
                            <img 
                              src={team.logo} 
                              alt={team.name} 
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0" 
                            />
                          )}
                          <span className="font-medium truncate text-foreground">{team.name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No teams found for this tournament.</p>
                  </div>
                )}

                {errors.teams && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.teams.message as string}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t mt-4 bg-background">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="sm:min-w-[120px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting || isImageUploading}
              className="sm:min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">↻</span>
                  {type === 'edit' ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                  type === 'edit' ? 'Update Group' : 'Create Group'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default GroupForm
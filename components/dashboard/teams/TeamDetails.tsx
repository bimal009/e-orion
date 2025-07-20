'use client'
import React, { useState } from 'react'
import { useGetTeamById } from '@/components/dashboard/api/useTeams'
import TeamForm from '@/components/dashboard/teams/TeamForm'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2, Edit3, Users, Trophy, Mail, Phone, User, Gamepad2 } from 'lucide-react'

type TeamDetailsPageProps = {
    id: string
    teamid: string
}

const TeamDetailsPage = ({id, teamid}:TeamDetailsPageProps) => {
  const { data: team, isLoading, error } = useGetTeamById(teamid)
  const [editOpen, setEditOpen] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [selectedImageAlt, setSelectedImageAlt] = useState<string>('')
  
    console.log(teamid, id)

  const handleImageClick = (imageUrl: string, altText: string) => {
    setSelectedImage(imageUrl)
    setSelectedImageAlt(altText)
    setImageDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin w-12 h-12 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading team details...</p>
        </div>
      </div>
    )
  }
  
  if (error || !team) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Failed to load team</h3>
              <p className="text-muted-foreground">Unable to retrieve team details. Please try again.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Team Header Card */}
      <Card className="border-border shadow-lg bg-muted">
        <CardHeader className="pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-shrink-0">
              <Avatar 
                className="w-20 h-20 border-4 border-primary/20 shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => team.logo && handleImageClick(team.logo, `${team.name} logo`)}
              >
                <AvatarImage src={team.logo || ""} alt={team.name} className="object-cover" />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {team.name[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-grow min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground">
                  {team.name}
                </CardTitle>
                {team.teamTag && (
                  <Badge variant="secondary" className="w-fit">
                    {team.teamTag}
                  </Badge>
                )}
              </div>
              
              <div className="space-y-2">
                {team.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{team.email}</span>
                  </div>
                )}
                {team.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{team.phone}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <Button 
                onClick={() => setEditOpen(true)} 
                variant="outline"
                className="bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Team
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 p-4 bg-background/50 rounded-lg">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">Tournament:</span>
            <span className="text-muted-foreground">
              {team.tournament?.name || 'No tournament assigned'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Players Section */}
      <Card className="border-border shadow-lg bg-muted">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl text-foreground">Team Players</CardTitle>
              <CardDescription>
                {team.players?.length || 0} player{(team.players?.length || 0) !== 1 ? 's' : ''} registered
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {team.players && team.players.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {team.players.map((player: any) => (
                <Card key={player.id} className="p-4 border-2 hover:border-primary/30 transition-colors bg-background">
                  <div className="flex items-start gap-4">
                    <Avatar 
                      className="w-12 h-12 border-2 border-primary/20 cursor-pointer hover:scale-105 transition-transform duration-200"
                      onClick={() => player.image && handleImageClick(player.image, `${player.name} avatar`)}
                    >
                      <AvatarImage src={player.image || ""} alt={player.name} className="object-cover" />
                      <AvatarFallback className="bg-primary/10 text-primary-foreground font-semibold">
                        {player.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 mb-2">
                        <h4 className="font-semibold text-foreground truncate">{player.name}</h4>
                        {player.ign && (
                          <Badge variant="outline" className="text-xs w-fit">
                            <Gamepad2 className="w-3 h-3 mr-1" />
                            {player.ign}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        {player.role && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="w-3 h-3" />
                            <span>Role: {player.role}</span>
                          </div>
                        )}
                        {player.email && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{player.email}</span>
                          </div>
                        )}
                        {player.phone && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            <span>{player.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">No players yet</h3>
              <p className="text-muted-foreground">Add players to your team to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Preview Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedImageAlt}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            <img 
              src={selectedImage} 
              alt={selectedImageAlt}
              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Team Form */}
      <TeamForm
        opened={editOpen}
        onClose={() => setEditOpen(false)}
        type="edit"
        initialData={team}
        tournmentId={id}
      />
    </div>
  )
}

export default TeamDetailsPage
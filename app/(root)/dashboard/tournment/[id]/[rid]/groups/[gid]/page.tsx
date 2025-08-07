"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetGroupById } from "@/components/dashboard/api/useGroup";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Users,
  Trophy,
  Calendar,
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
  Gamepad2,
  Target,
  Medal,
  Star,
  TrendingUp,
  Activity,
  Shield,
  Zap,
  Crown,
  Flag,
  Hash,
} from "lucide-react";
import { FullScreenLoader } from "@/components/shared/Loader";
import Image from "next/image";
import type { Team } from "@/lib/types";
import type { Match } from "@/lib/types";

export default function GroupDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.gid as string;
  const tournamentId = params.id as string;
  const roundId = params.rid as string;

  const { data: group, isLoading, error } = useGetGroupById(groupId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FullScreenLoader />
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Group Not Found</h3>
              <p className="text-muted-foreground mb-4">
                The group you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const teams = group.teams || [];
  const matches = group.matches || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="hover:bg-accent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {group.name}
                </h1>
                <p className="text-sm text-muted-foreground">Group Details</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              <Hash className="w-3 h-3 mr-1" />
              {group.id.slice(-8)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Teams
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {teams.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-secondary/10 rounded-xl">
                  <Trophy className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Matches
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {matches.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <Activity className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Teams
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {teams.filter((team: Team) => team.isSelected).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-500/10 rounded-xl">
                  <Clock className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Upcoming Matches
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {
                      matches.filter(
                        (match: Match) => new Date(match.startTime) > new Date()
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Teams Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span>Teams ({teams.length})</span>
              </CardTitle>
              <CardDescription>
                All teams participating in this group
              </CardDescription>
            </CardHeader>
            <CardContent>
              {teams.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    No teams assigned to this group yet
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {teams.map((team: Team, index: number) => (
                      <div
                        key={team.id}
                        className="flex items-center space-x-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={team.logo || ""}
                              alt={team.name}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {team.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-foreground truncate">
                                {team.name}
                              </h4>
                              {team.isSelected && (
                                <Badge variant="default" className="text-xs">
                                  <Star className="w-3 h-3 mr-1" />
                                  Selected
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              {team.teamTag && (
                                <span className="flex items-center">
                                  <Flag className="w-3 h-3 mr-1" />
                                  {team.teamTag}
                                </span>
                              )}
                              <span className="flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                {team.players?.length || 0} players
                              </span>
                            </div>
                            {(team.email || team.phone) && (
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                                {team.email && (
                                  <span className="flex items-center">
                                    <Mail className="w-3 h-3 mr-1" />
                                    {team.email}
                                  </span>
                                )}
                                {team.phone && (
                                  <span className="flex items-center">
                                    <Phone className="w-3 h-3 mr-1" />
                                    {team.phone}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Matches Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span>Matches ({matches.length})</span>
              </CardTitle>
              <CardDescription>
                All matches scheduled for this group
              </CardDescription>
            </CardHeader>
            <CardContent>
              {matches.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Trophy className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    No matches scheduled for this group yet
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {matches.map((match: Match) => (
                      <div
                        key={match.id}
                        className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground truncate">
                              {match.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Match #{match.matchNo}
                            </p>
                          </div>
                          <Badge
                            variant={
                              new Date(match.startTime) > new Date()
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {new Date(match.startTime) > new Date()
                              ? "Upcoming"
                              : "Completed"}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(match.startTime).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(match.startTime).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                          {match.mapId && (
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{match.mapId}</span>
                            </div>
                          )}
                        </div>

                        {match.endTime && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>
                                Ended:{" "}
                                {new Date(match.endTime).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tournament Info */}
        {group.tournament && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-primary" />
                <span>Tournament Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden">
                    {group.tournament.logo ? (
                      <Image
                        src={group.tournament.logo}
                        alt={group.tournament.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <Trophy className="w-8 h-8 text-primary" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {group.tournament.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">Tournament</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium">
                      {group.tournament.createdAt &&
                        new Date(
                          group.tournament.createdAt
                        ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Updated:</span>
                    <span className="font-medium">
                      {group.tournament.updatedAt &&
                        new Date(
                          group.tournament.updatedAt
                        ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full border-2"
                      style={{
                        backgroundColor: group.tournament.selectedTheme,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() =>
              router.push(`/dashboard/tournment/${tournamentId}/teams`)
            }
            className="flex-1 sm:flex-none"
          >
            <Users className="w-4 h-4 mr-2" />
            Manage Teams
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/dashboard/tournment/${tournamentId}/${roundId}`)
            }
            className="flex-1 sm:flex-none"
          >
            <Trophy className="w-4 h-4 mr-2" />
            View Round
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/tournment/${tournamentId}`)}
            className="flex-1 sm:flex-none"
          >
            <Crown className="w-4 h-4 mr-2" />
            Tournament Overview
          </Button>
        </div>
      </div>
    </div>
  );
}

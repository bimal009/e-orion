"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  X,
  Trophy,
  Plus,
  UserPlus,
  Users,
  Hash,
  Upload,
  User,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useFieldArray } from "react-hook-form";
import { useCreateTeam, useUpdateTeam } from "../api/useTeams";
import CloudinaryUploader from "../tournments/CloudnaryUploader";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

// Zod validation schema
const playerSchema = z.object({
  name: z.string().min(1, "Player name is required"),
  ign: z.string().min(1, "IGN is required"),
  role: z.string().optional(),
  image: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  isPlaying: z.boolean(), // required boolean
});

const roundSchema = z.object({
  name: z
    .string()
    .min(3, "Team name must be at least 3 characters")
    .max(50, "Team name must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "Team name can only contain letters, numbers, spaces, hyphens, and underscores"
    ),
  teamTag: z.string().optional(),
  logo: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  players: z.array(playerSchema).min(1, "At least one player is required"),
});

type RoundFormData = z.infer<typeof roundSchema>;

type FormProps = {
  opened: boolean;
  onClose?: () => void;
  onSubmit?: (data: RoundFormData) => void;
  type: "create" | "edit";
  initialData?: any;
  tournmentId: string;
};

const TeamForm = ({
  opened,
  onClose,
  onSubmit,
  type,
  initialData,
  tournmentId,
}: FormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTeamLogoUploading, setIsTeamLogoUploading] = useState(false);
  const [playerImageUploading, setPlayerImageUploading] = useState<{
    [idx: number]: boolean;
  }>({});

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
    control,
  } = useForm<RoundFormData>({
    resolver: zodResolver(roundSchema),
    mode: "onChange",
    defaultValues: initialData || {
      name: "",
      teamTag: "",
      logo: "",
      email: "",
      phone: "",
      players: [
        {
          name: "",
          ign: "",
          role: "",
          image: "",
          email: "",
          phone: "",
          isPlaying: false, // always present
        },
      ],
    },
  });

  const {
    fields: playerFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "players",
  });

  const createTeamMutation = useCreateTeam();
  const updateTeamMutation = useUpdateTeam();

  React.useEffect(() => {
    if (initialData) {
      reset({ ...initialData });
    } else {
      reset({
        name: "",
        teamTag: "",
        logo: "",
        email: "",
        phone: "",
        players: [
          {
            name: "",
            ign: "",
            role: "",
            image: "",
            email: "",
            phone: "",
            isPlaying: false, // always present
          },
        ],
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = async (data: RoundFormData) => {
    setIsSubmitting(true);

    try {
      const formData = {
        ...data,
        ...(type === "edit" && initialData?.id ? { id: initialData.id } : {}),
        tournamentId: tournmentId,
      };
      

      if (type === "edit") {
        await updateTeamMutation.mutateAsync(formData as any);
      } else {
        await createTeamMutation.mutateAsync(formData as any);
      }

      reset();
      onClose?.();

      toast.success(
        type === "edit"
          ? "Team updated successfully"
          : "Team created successfully"
      );
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error(
        type === "edit" ? "Failed to update team" : "Failed to create team"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };

  return (
    <Dialog
      open={opened}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-4xl max-w-[95vw] max-h-[90vh] overflow-hidden">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <Trophy className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-foreground">
                {type === "edit" ? "Edit Team" : "Create New Team"}
              </span>
              <DialogDescription className="text-sm text-muted-foreground">
                {type === "edit"
                  ? "Update team information and player details"
                  : "Set up your esports team with players and details"}
              </DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Team Logo Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Upload className="h-5 w-5" />
                  Team Logo
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Upload your team logo (PNG format recommended)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <CloudinaryUploader
                    onImageUpload={(url) =>
                      setValue("logo", url, { shouldValidate: true })
                    }
                    previewImage={watch("logo") || null}
                    aspectRatio="square"
                    placeholderText="Upload Team Logo"
                    onUploadingChange={setIsTeamLogoUploading}
                  />
                  <Input type="hidden" {...register("logo")} />
                  {errors.logo && (
                    <p className="text-sm font-medium text-destructive flex items-center gap-1">
                      <X className="h-4 w-4" />
                      {errors.logo.message as string}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Team Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Trophy className="h-5 w-5" />
                  Team Details
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Basic information about your team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Team Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="flex items-center gap-2 text-foreground"
                    >
                      <Users className="h-4 w-4" />
                      Team Name
                    </Label>
                    <Input
                      {...register("name")}
                      id="name"
                      placeholder="Enter team name"
                      className={cn(
                        "transition-all duration-200 bg-background",
                        errors.name &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {errors.name && (
                      <p className="text-sm font-medium text-destructive flex items-center gap-1">
                        <X className="h-4 w-4" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="teamTag"
                      className="flex items-center gap-2 text-foreground"
                    >
                      <Users className="h-4 w-4" />
                      Team Tag
                    </Label>
                    <Input
                      {...register("teamTag")}
                      id="teamTag"
                      placeholder="Enter team tag"
                      className={cn(
                        "transition-all duration-200 bg-background",
                        errors.teamTag &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {errors.teamTag && (
                      <p className="text-sm font-medium text-destructive flex items-center gap-1">
                        <X className="h-4 w-4" />
                        {errors.teamTag.message}
                      </p>
                    )}
                  </div>
                  {/* Team Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="flex items-center gap-2 text-foreground"
                    >
                      <Users className="h-4 w-4" />
                      Team Email
                    </Label>
                    <Input
                      {...register("email")}
                      id="email"
                      placeholder="Enter team email"
                      className={cn(
                        "transition-all duration-200 bg-background",
                        errors.email &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {errors.email && (
                      <p className="text-sm font-medium text-destructive flex items-center gap-1">
                        <X className="h-4 w-4" />
                        {errors.email.message as string}
                      </p>
                    )}
                  </div>
                  {/* Team Phone */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="flex items-center gap-2 text-foreground"
                    >
                      <Users className="h-4 w-4" />
                      Team Phone
                    </Label>
                    <Input
                      {...register("phone")}
                      id="phone"
                      placeholder="Enter team phone"
                      className={cn(
                        "transition-all duration-200 bg-background",
                        errors.phone &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {errors.phone && (
                      <p className="text-sm font-medium text-destructive flex items-center gap-1">
                        <X className="h-4 w-4" />
                        {errors.phone.message as string}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Players Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Users className="h-5 w-5" />
                      Team Players
                      <Badge variant="secondary" className="ml-2">
                        {playerFields.length}{" "}
                        {playerFields.length === 1 ? "Player" : "Players"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Add and manage your team members
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      append({
                        name: "",
                        ign: "",
                        role: "",
                        image: "",
                        email: "",
                        phone: "",
                        isPlaying: false, // always present
                      })
                    }
                    className="shrink-0"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Player
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {playerFields.map((field, idx) => (
                    <Card key={field.id} className="relative">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base flex items-center gap-2 text-foreground">
                            <User className="h-4 w-4" />
                            Player {idx + 1}
                          </CardTitle>
                          {playerFields.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => remove(idx)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Player Image */}
                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-foreground">
                              Player Image
                              <Badge variant="outline" className="ml-2 text-xs">
                                PNG only
                              </Badge>
                            </Label>
                            <CloudinaryUploader
                              onImageUpload={(url) =>
                                setValue(`players.${idx}.image`, url, {
                                  shouldValidate: true,
                                })
                              }
                              previewImage={
                                watch(`players.${idx}.image`) || null
                              }
                              aspectRatio="circle"
                              placeholderText="Upload Player Image"
                              onUploadingChange={(uploading) =>
                                setPlayerImageUploading((prev) => ({
                                  ...prev,
                                  [idx]: uploading,
                                }))
                              }
                            />
                            <Input
                              type="hidden"
                              {...register(`players.${idx}.image` as const)}
                            />
                            {errors.players?.[idx]?.image && (
                              <p className="text-sm font-medium text-destructive flex items-center gap-1">
                                <X className="h-4 w-4" />
                                {errors.players[idx]?.image?.message as string}
                              </p>
                            )}
                          </div>
                          {/* Player Details */}
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor={`players.${idx}.name`}
                                className="text-foreground"
                              >
                                Player Name
                              </Label>
                              <Input
                                {...register(`players.${idx}.name` as const)}
                                id={`players.${idx}.name`}
                                placeholder="Enter player name"
                                className={cn(
                                  "transition-all duration-200 bg-background",
                                  errors.players?.[idx]?.name &&
                                    "border-destructive focus-visible:ring-destructive"
                                )}
                              />
                              {errors.players?.[idx]?.name && (
                                <p className="text-sm font-medium text-destructive flex items-center gap-1">
                                  <X className="h-4 w-4" />
                                  {errors.players[idx]?.name?.message as string}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor={`players.${idx}.ign`}
                                className="text-foreground"
                              >
                                In-Game Name (IGN)
                              </Label>
                              <Input
                                {...register(`players.${idx}.ign` as const)}
                                id={`players.${idx}.ign`}
                                placeholder="Enter IGN"
                                className={cn(
                                  "transition-all duration-200 bg-background",
                                  errors.players?.[idx]?.ign &&
                                    "border-destructive focus-visible:ring-destructive"
                                )}
                              />
                              {errors.players?.[idx]?.ign && (
                                <p className="text-sm font-medium text-destructive flex items-center gap-1">
                                  <X className="h-4 w-4" />
                                  {errors.players[idx]?.ign?.message as string}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor={`players.${idx}.role`}
                                className="text-foreground"
                              >
                                Role
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-xs"
                                >
                                  Optional
                                </Badge>
                              </Label>
                              <Input
                                {...register(`players.${idx}.role` as const)}
                                id={`players.${idx}.role`}
                                placeholder="e.g., Captain, Support, DPS"
                                className={cn(
                                  "transition-all duration-200 bg-background",
                                  errors.players?.[idx]?.role &&
                                    "border-destructive focus-visible:ring-destructive"
                                )}
                              />
                              {errors.players?.[idx]?.role && (
                                <p className="text-sm font-medium text-destructive flex items-center gap-1">
                                  <X className="h-4 w-4" />
                                  {errors.players[idx]?.role?.message as string}
                                </p>
                              )}
                            </div>
                            {/* Player Email */}
                            <div className="space-y-2">
                              <Label
                                htmlFor={`players.${idx}.email`}
                                className="text-foreground"
                              >
                                Player Email
                              </Label>
                              <Input
                                {...register(`players.${idx}.email` as const)}
                                id={`players.${idx}.email`}
                                placeholder="Enter player email"
                                className={cn(
                                  "transition-all duration-200 bg-background",
                                  errors.players?.[idx]?.email &&
                                    "border-destructive focus-visible:ring-destructive"
                                )}
                              />
                              {errors.players?.[idx]?.email && (
                                <p className="text-sm font-medium text-destructive flex items-center gap-1">
                                  <X className="h-4 w-4" />
                                  {
                                    errors.players[idx]?.email
                                      ?.message as string
                                  }
                                </p>
                              )}
                            </div>
                            {/* Player Phone */}
                            <div className="space-y-2">
                              <Label
                                htmlFor={`players.${idx}.phone`}
                                className="text-foreground"
                              >
                                Player Phone
                              </Label>
                              <Input
                                {...register(`players.${idx}.phone` as const)}
                                id={`players.${idx}.phone`}
                                placeholder="Enter player phone"
                                className={cn(
                                  "transition-all duration-200 bg-background",
                                  errors.players?.[idx]?.phone &&
                                    "border-destructive focus-visible:ring-destructive"
                                )}
                              />
                              {errors.players?.[idx]?.phone && (
                                <p className="text-sm font-medium text-destructive flex items-center gap-1">
                                  <X className="h-4 w-4" />
                                  {
                                    errors.players[idx]?.phone
                                      ?.message as string
                                  }
                                </p>
                              )}
                            </div>
                            <div className="space-y-2 flex gap-3 items-center">
                              <span className=" ">Playing</span>
                              <Switch
                                checked={watch(`players.${idx}.isPlaying`)}
                                onCheckedChange={(checked) =>
                                  setValue(`players.${idx}.isPlaying`, checked)
                                }
                                className={cn(
                                  "w-8 transition-all duration-200",
                                  watch(`players.${idx}.isPlaying`)
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-background"
                                )}
                              >
                                isPlaying
                              </Switch>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {typeof errors.players === "object" &&
                  !Array.isArray(errors.players) && (
                    <p className="text-sm font-medium text-destructive flex items-center gap-1 mt-4">
                      <X className="h-4 w-4" />
                      {(errors.players as any)?.message}
                    </p>
                  )}
              </CardContent>
            </Card>
          </form>
        </ScrollArea>

        <Separator />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="sm:min-w-32"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              !isValid ||
              isSubmitting ||
              isTeamLogoUploading ||
              Object.values(playerImageUploading).some(Boolean)
            }
            onClick={handleSubmit(onFormSubmit)}
            className="sm:min-w-32"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {type === "edit" ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Trophy className="h-4 w-4 mr-2" />
                {type === "edit" ? "Update Team" : "Create Team"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamForm;

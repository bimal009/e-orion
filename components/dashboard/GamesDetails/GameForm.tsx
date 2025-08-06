"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Trophy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useGetMaps } from "../api/useMaps";
import { useGetGroupsByRoundId } from "../api/useGroup";
import { useCreateGame, useUpdateGame } from "../api/useGames";
import type { Map, Group } from "@/lib/types";

// Zod validation schema
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Helper to convert time string (HH:mm) to Date object (today's date)
function timeStringToDate(time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const now = new Date();
  now.setHours(hours, minutes, 0, 0);
  return now;
}

// Helper to convert any value to 'HH:mm' string
function toTimeString(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val.slice(0, 5);
  if (val instanceof Date) {
    return val.toTimeString().slice(0, 5);
  }
  if (typeof val === "number") {
    return new Date(val).toTimeString().slice(0, 5);
  }
  return "";
}

const gameSchema = z.object({
  matchNo: z.coerce
    .number({
      invalid_type_error: "Please enter a valid match number",
      required_error: "Match number is required",
    })
    .min(1, "Match number must be at least 1"),

  name: z
    .string()
    .min(3, "Game name must be at least 3 characters")
    .max(50, "Game name must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "Game name can only contain letters, numbers, spaces, hyphens, and underscores"
    ),

  mapId: z.string().min(1, "Please select a map"),

  startTime: z
    .string()
    .min(1, "Start time is required")
    .regex(timeRegex, "Please enter a valid start time (HH:mm)"),

  endTime: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return timeRegex.test(val);
    }, "Please enter a valid end time (HH:mm)"),

  groupId: z.string().min(1, "Please select a group"),

  day: z.coerce
    .number({
      invalid_type_error: "Please enter a valid day",
      required_error: "Day is required",
    })
    .min(1, "Day must be at least 1"),

  pointsTableId: z.string().optional(),
});

type GameFormData = z.infer<typeof gameSchema>;

type GameFormProps = {
  opened: boolean;
  onClose?: () => void;
  onSubmit?: (data: GameFormData) => void;
  type: "create" | "edit";
  initialData?: any;
  tournmentId: string;
  roundId: string;
};

const GameForm = ({
  opened,
  onClose,
  onSubmit,
  type,
  initialData,
  tournmentId,
  roundId,
}: GameFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data using hooks
  const { data: mapsData, isPending: isMapsPending } = useGetMaps();
  const { data: groupsData, isPending: isGroupsPending } =
    useGetGroupsByRoundId(roundId);
  const { mutate, isPending } =
    type === "edit" ? useUpdateGame() : useCreateGame();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
    control,
  } = useForm<GameFormData>({
    resolver: zodResolver(gameSchema),
    mode: "onChange",
    defaultValues: initialData || {
      matchNo: 1,
      name: "",
      mapId: "",
      startTime: "",
      endTime: "",
      groupId: "",
      day: 1,
      pointsTableId: "",
    },
  });

  React.useEffect(() => {
    if (initialData) {
      const formattedData = {
        ...initialData,
        startTime: toTimeString(initialData.startTime),
        endTime: toTimeString(initialData.endTime),
        day: initialData.day ?? 1,
      };
      reset(formattedData);
    } else {
      reset({
        matchNo: 1,
        name: "",
        mapId: "",
        startTime: "",
        endTime: "",
        groupId: "",
        day: 1,
        pointsTableId: "",
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = async (data: GameFormData) => {
    setIsSubmitting(true);

    try {
      const formData = {
        ...data,
        startTime: timeStringToDate(data.startTime),
        endTime: data.endTime ? timeStringToDate(data.endTime) : undefined,
        ...(type === "edit" && initialData?.id ? { id: initialData.id } : {}),
        tournamentId: tournmentId,
        roundId: roundId,
        day: data.day,
        pointsTableId: data.pointsTableId || "",
      };

      mutate(formData);

      reset();
      onClose?.();

      toast.success(
        type === "edit"
          ? "Game updated successfully"
          : "Game created successfully"
      );
    } catch (error) {
      toast.error(
        type === "edit" ? "Failed to update game" : "Failed to create game"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };

  const maps = mapsData || [];

  const groups = groupsData || [];

  return (
    <Dialog
      open={opened}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-3xl max-w-[95vw] rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Trophy className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-foreground">
              {type === "edit" ? "Edit Game" : "Create New Game"}
            </span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {type === "edit"
              ? "Update the details below to edit the game."
              : "Fill in the details below to create a new game."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="grid grid-cols-1 gap-6">
            {/* First Row: Match Number and Game Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="matchNo" className="text-foreground">
                  Match Number
                </Label>
                <Input
                  {...register("matchNo", { valueAsNumber: true })}
                  type="number"
                  id="matchNo"
                  placeholder="Enter match number"
                  className="bg-background"
                  min="1"
                />
                {errors.matchNo && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.matchNo.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Game Name
                </Label>
                <Input
                  {...register("name")}
                  type="text"
                  id="name"
                  placeholder="Enter game name"
                  className="bg-background"
                />
                {errors.name && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            {/* Day No Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="day" className="text-foreground">
                  day
                </Label>
                <Input
                  {...register("day", { valueAsNumber: true })}
                  type="number"
                  id="day"
                  placeholder="Enter day"
                  className="bg-background"
                  min="1"
                />
                {errors.day && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.day.message}
                  </p>
                )}
              </div>
            </div>

            {/* Second Row: Map Selection and Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mapId" className="text-foreground">
                  Map
                </Label>
                <Select
                  value={watch("mapId") || ""}
                  onValueChange={(value) =>
                    setValue("mapId", value, { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select a map" />
                  </SelectTrigger>
                  <SelectContent>
                    {maps.map((map: Map) => (
                      <SelectItem key={map.id} value={map.id}>
                        {map.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.mapId && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.mapId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="groupId" className="text-foreground">
                  Group
                </Label>
                <Select
                  value={watch("groupId") || ""}
                  onValueChange={(value) =>
                    setValue("groupId", value, { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.groupId && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.groupId.message}
                  </p>
                )}
              </div>
            </div>

            {/* Third Row: Start and End Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-foreground">
                  Start Time
                </Label>
                <Input
                  {...register("startTime")}
                  type="time"
                  id="startTime"
                  className="bg-background"
                />
                {errors.startTime && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.startTime.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-foreground">
                  End Time (Optional)
                </Label>
                <Input
                  {...register("endTime")}
                  type="time"
                  id="endTime"
                  className="bg-background"
                />
                {errors.endTime && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.endTime.message}
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
              disabled={
                !isValid || isSubmitting || isMapsPending || isGroupsPending
              }
              className="flex-1 sm:flex-none sm:max-w-xs order-1 sm:order-2"
            >
              {isSubmitting || isMapsPending || isGroupsPending ? (
                <>
                  <span className="animate-spin mr-2">↻</span>
                  {type === "edit" ? "Updating..." : "Creating..."}
                </>
              ) : type === "edit" ? (
                "Update Game"
              ) : (
                "Create Game"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GameForm;

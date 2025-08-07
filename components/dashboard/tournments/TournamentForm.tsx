"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Trophy, Check } from "lucide-react";
import CloudinaryUploader from "./CloudnaryUploader";
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
import { toast } from "sonner";
import { useCreateTournament, useUpdateTournament } from "../api/UseTournment";

// Predefined color themes
const colorThemes = [
  { name: "Red", value: "#FB2C36" },
  { name: "Rose", value: "#FF2056" },
  { name: "Orange", value: "#FF6900" },
  { name: "Green", value: "#5EA500" },
  { name: "Blue", value: "#2B7FFF" },
  { name: "Yellow", value: "#F0B100" },
  { name: "Violet", value: "#8E51FF" },
];

// Zod validation schema
const tournamentSchema = z.object({
  name: z
    .string()
    .min(3, "Tournament name must be at least 3 characters")
    .max(50, "Tournament name must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "Tournament name can only contain letters, numbers, spaces, hyphens, and underscores"
    ),
  logo: z
    .string()
    .url("Please upload a valid logo image")
    .optional()
    .or(z.literal("")),
  ownerId: z.string(),
  selectedTheme: z
    .string()
    .min(1, "Please select a theme color")
    .refine(
      (value) => colorThemes.some((theme) => theme.name === value),
      "Please select a valid theme color"
    ),
});

type TournamentFormData = z.infer<typeof tournamentSchema>;

type FormProps = {
  opened: boolean;
  onClose?: () => void;
  onSubmit?: (data: TournamentFormData & { logo: string }) => void;
  type: "create" | "edit";
  initialData?: any;
};

const TournamentForm = ({
  opened,
  onClose,
  onSubmit,
  type,
  initialData,
}: FormProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(
    initialData?.logo || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  // Keep track of the original image URL for edit mode
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(
    initialData?.logo || null
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentSchema),
    mode: "onChange",
    defaultValues: initialData || {
      name: "",
      logo: "",
      ownerId: "",
      selectedTheme: "",
    },
  });

  const selectedTheme = watch("selectedTheme");

  React.useEffect(() => {
    if (initialData) {
      // If initialData has a selectedTheme that's a hex value, convert it to name
      let themeName = initialData.selectedTheme;
      if (
        initialData.selectedTheme &&
        initialData.selectedTheme.startsWith("#")
      ) {
        const theme = colorThemes.find(
          (t) => t.value === initialData.selectedTheme
        );
        themeName = theme?.name || initialData.selectedTheme;
      }

      reset({
        ...initialData,
        selectedTheme: themeName,
      });
      setImageUrl(initialData.logo || null);
      setOriginalImageUrl(initialData.logo || null);
    } else {
      reset({
        name: "",
        logo: "",
        ownerId: "",
        selectedTheme: "",
      });
      setImageUrl(null);
      setOriginalImageUrl(null);
    }
  }, [initialData, reset]);

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
    setValue("logo", url, { shouldValidate: true });
  };

  const handleThemeSelect = (colorValue: string) => {
    // Find the theme name based on the color value
    const selectedTheme = colorThemes.find(
      (theme) => theme.value === colorValue
    );
    if (selectedTheme) {
      setValue("selectedTheme", selectedTheme.name, { shouldValidate: true });
    }
  };

  const { mutate, isPending } =
    type === "edit" ? useUpdateTournament() : useCreateTournament();

  const onFormSubmit = async (data: TournamentFormData) => {
    if (!imageUrl) {
      toast.error("Please upload a tournament logo");
      return;
    }

    if (!data.selectedTheme) {
      toast.error("Please select a theme color");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = {
        ...data,
        logo: imageUrl,
        ...(type === "edit" && initialData?.id ? { id: initialData.id } : {}),
      };

      
      mutate(formData);

      // Reset form
      reset();
      setImageUrl(null);
      setOriginalImageUrl(null);
      onClose?.();

      toast.success(
        type === "edit"
          ? "Tournament updated successfully"
          : "Tournament created successfully"
      );
    } catch (error) {
      console.error("Error creating tournament:", error);
      toast.error(
        type === "edit"
          ? "Failed to update tournament"
          : "Failed to create tournament"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Restore original image URL if in edit mode
    if (type === "edit" && originalImageUrl) {
      setImageUrl(originalImageUrl);
    } else {
      setImageUrl(null);
    }
    reset();
    onClose?.();
  };

  return (
    <Dialog open={opened} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-w-[95vw] rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Trophy className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-foreground">
              {type === "edit" ? "Edit Tournament" : "Create New Tournament"}
            </span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {type === "edit"
              ? "Update the details below to edit the tournament."
              : "Fill in the details below to create a new tournament."}
          </DialogDescription>
        </DialogHeader>

        {/* Tournament Banner */}
        <div className="mb-6">
          <Label className="mb-2 block text-foreground">
            {type === "edit" ? "Change Image" : "Tournament Banner"}
          </Label>
          <CloudinaryUploader
            onImageUpload={handleImageUpload}
            previewImage={imageUrl}
            placeholderText={
              type === "edit"
                ? "Change image"
                : "Drop your image here, or browse"
            }
            aspectRatio="rectangle"
            className="border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors w-full min-h-[220px] flex items-center justify-center"
            onUploadingChange={setIsImageUploading}
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
              <Label htmlFor="name" className="text-foreground">
                Tournament Name
              </Label>
              <Input
                {...register("name")}
                type="text"
                id="name"
                placeholder="Enter tournament name"
                className="bg-background"
              />
              {errors.name && (
                <p className="text-sm font-medium text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Theme Color Selection */}
            <div className="space-y-3">
              <Label className="text-foreground">Select Theme Color</Label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                {colorThemes.map((theme) => (
                  <button
                    key={theme.value}
                    type="button"
                    onClick={() => handleThemeSelect(theme.value)}
                    className={`relative w-12 h-12 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                      selectedTheme === theme.name
                        ? "border-foreground shadow-lg"
                        : "border-border hover:border-foreground/50"
                    }`}
                    style={{ backgroundColor: theme.value }}
                    title={theme.name}
                  >
                    {selectedTheme === theme.name && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="h-5 w-5 text-white drop-shadow-lg" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {errors.selectedTheme && (
                <p className="text-sm font-medium text-destructive">
                  {errors.selectedTheme.message}
                </p>
              )}
              {selectedTheme && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">
                    Selected:
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded border border-border"
                      style={{
                        backgroundColor: colorThemes.find(
                          (theme) => theme.name === selectedTheme
                        )?.value,
                      }}
                    />
                    <span className="text-sm font-medium">{selectedTheme}</span>
                    <span className="text-sm text-muted-foreground font-mono">
                      (
                      {
                        colorThemes.find(
                          (theme) => theme.name === selectedTheme
                        )?.value
                      }
                      )
                    </span>
                  </div>
                </div>
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
              disabled={
                !isValid ||
                !imageUrl ||
                !selectedTheme ||
                isSubmitting ||
                isPending ||
                isImageUploading
              }
              className="flex-1 sm:flex-none sm:max-w-xs order-1 sm:order-2"
            >
              {isSubmitting || isPending ? (
                <>
                  <span className="animate-spin mr-2">↻</span>
                  {type === "edit" ? "Updating..." : "Creating..."}
                </>
              ) : type === "edit" ? (
                "Update Tournament"
              ) : (
                "Create Tournament"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TournamentForm;

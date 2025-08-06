import Image from "next/image";
import {
  Trophy,
  Calendar,
  Users,
  MoreVertical,
  CircleAlert,
  CircleDot,
  Edit3,
  Trash2,
} from "lucide-react";
import { Tournament } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useDeleteTournament } from "../api/UseTournment";
import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";

interface TournamentCardProps {
  tournament: Tournament;
  onEdit?: (tournament: Tournament) => void;
}

const TournamentCard = ({ tournament, onEdit }: TournamentCardProps) => {
  const { mutate, isPending } = useDeleteTournament();
  const handleDelete = (id: string) => {
    mutate(id);
  };
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div
      className="group bg-muted border border-border hover:border-primary hover:scale-[1.02] duration-300 transition-all rounded-2xl shadow-lg hover:shadow-2xl p-6 relative cursor-pointer overflow-hidden"
      onClick={() => router.push(`/dashboard/tournment/${tournament.id}`)}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300 bg-accent flex items-center justify-center">
              <Trophy className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                {tournament.name}
              </h3>
              <p className="text-sm text-muted-foreground">Tournament</p>
            </div>
          </div>

          {/* Menu Button */}
          <div
            className="relative z-20"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
          >
            <button className="p-2 rounded-xl hover:bg-accent focus:outline-none transition-colors opacity-60 hover:opacity-100">
              <MoreVertical size={18} />
            </button>
            {menuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-2 w-40 bg-popover backdrop-blur-sm border border-border rounded-xl shadow-xl py-2 z-50"
              >
                <button
                  className="flex items-center w-full text-left px-4 py-3 text-sm hover:bg-accent text-foreground transition-colors rounded-lg mx-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onEdit && onEdit(tournament);
                  }}
                >
                  <Edit3 size={16} className="mr-3" />
                  Edit
                </button>
                <button
                  className="flex items-center w-full text-left px-4 py-3 text-sm hover:bg-destructive/10 text-destructive transition-colors rounded-lg mx-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    tournament.id && handleDelete(tournament.id);
                  }}
                  disabled={isPending}
                >
                  <Trash2 size={16} className="mr-3" />
                  {isPending ? (
                    <>
                      <span className="animate-spin mr-1">↻</span>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-accent rounded-xl border border-border">
            <div className="flex items-center space-x-2">
              <CircleDot className="text-primary w-5 h-5" />
              <span className="font-medium text-sm text-foreground">
                Rounds
              </span>
            </div>
            <span className="font-bold text-primary text-lg">
              {tournament.rounds?.length || 0}
            </span>
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </div>
    </div>
  );
};

export default TournamentCard;

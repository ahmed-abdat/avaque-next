"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Pencil, Trash2 } from "lucide-react";
import { Review } from "../../types";

interface UserProfile {
  name: string;
  avatarUrl: string | null;
}

interface ReviewCardProps {
  review: Review;
  onEdit: (review: Review) => void;
  onDelete: (review: Review) => void;
  canModify: boolean;
  userProfile?: UserProfile;
}

export function ReviewCard({
  review,
  onEdit,
  onDelete,
  canModify,
  userProfile,
}: ReviewCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {userProfile?.avatarUrl && (
                <AvatarImage
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                />
              )}
              <AvatarFallback>
                {userProfile?.name?.[0] || review.student_id[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium line-clamp-1">
                {userProfile?.name || review.student_id}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{review.rating}</span>
            </div>
            {canModify && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(review)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(review)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <p className="text-muted-foreground line-clamp-3">{review.comment}</p>
      </CardContent>
    </Card>
  );
}

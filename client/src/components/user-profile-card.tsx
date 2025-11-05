import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { QrCode, User } from "lucide-react";
import type { ProfileWithUser } from "@shared/schema";

interface UserProfileCardProps {
  profile: ProfileWithUser;
}

export function UserProfileCard({ profile }: UserProfileCardProps) {
  return (
    <Card className="hover-elevate" data-testid={`user-card-${profile.id}`}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={profile.user.photoURL || undefined} />
            <AvatarFallback className="text-lg">
              {profile.user.displayName.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{profile.user.displayName}</h3>
            {profile.role && (
              <p className="text-sm text-muted-foreground truncate">{profile.role}</p>
            )}
            {profile.company && (
              <p className="text-sm text-muted-foreground truncate">{profile.company}</p>
            )}
          </div>
        </div>

        {profile.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2">{profile.bio}</p>
        )}

        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Offer</Badge>
            </div>
            <p className="text-sm line-clamp-2">{profile.offer}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Ask</Badge>
            </div>
            <p className="text-sm line-clamp-2">{profile.ask}</p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            data-testid={`button-view-qr-${profile.id}`}
          >
            <QrCode className="w-4 h-4 mr-2" />
            View QR
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            data-testid={`button-view-profile-${profile.id}`}
          >
            <User className="w-4 h-4 mr-2" />
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

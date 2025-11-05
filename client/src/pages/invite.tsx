import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Calendar, Users, Sparkles } from "lucide-react";
import type { RoomWithOrganizer } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function InvitePage() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const { data: circle, isLoading } = useQuery<RoomWithOrganizer>({
    queryKey: ["/api/circles/slug", slug],
    queryFn: async () => {
      const response = await fetch(`/api/circles/slug/${slug}`);
      if (!response.ok) throw new Error("Circle not found");
      return response.json();
    },
    enabled: !!slug,
  });

  const joinMutation = useMutation({
    mutationFn: async (circleId: string) => {
      const res = await apiRequest("POST", `/api/circles/${circleId}/join`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms"] });
      toast({
        title: "Joined!",
        description: "You're now part of this circle. Let the flow begin!",
      });
      setLocation(`/app/rooms/${circle?.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join circle",
        variant: "destructive",
      });
    },
  });

  const handleJoin = async () => {
    if (!user) {
      // Redirect to auth with return URL
      setLocation(`/auth?return=/invite/${slug}`);
      return;
    }

    if (!circle) return;

    joinMutation.mutate(circle.id);
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-2xl p-12">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Circle Not Found</h2>
            <p className="text-muted-foreground">
              This invitation link is invalid or the circle has been removed.
            </p>
            <Button onClick={() => setLocation("/")} className="rounded-full">
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h1 className="text-3xl font-bold tracking-wide">AMURA</h1>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <p className="text-lg text-muted-foreground">
            You've been invited to enter the flow
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-2xl">{circle.name}</CardTitle>
                {circle.isActive && (
                  <Badge variant="default">In Flow</Badge>
                )}
              </div>
            </div>
            {circle.description && (
              <CardDescription className="text-base pt-2">
                {circle.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3">
              {circle.location && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5" />
                  <span className="text-base">{circle.location}</span>
                </div>
              )}
              {circle.eventDate && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-5 h-5" />
                  <span className="text-base">
                    {new Date(circle.eventDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 text-muted-foreground">
                <Users className="w-5 h-5" />
                <span className="text-base">
                  {circle.participantCount || 0} {circle.participantCount === 1 ? "person" : "people"} in flow
                  {circle.capacity && ` • ${circle.capacity} max`}
                </span>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                onClick={handleJoin}
                size="lg"
                className="w-full rounded-full"
                disabled={joinMutation.isPending}
                data-testid="button-join-circle"
              >
                {joinMutation.isPending ? "Joining..." : (user ? "Enter Flow" : "Sign Up to Join")}
              </Button>
              
              {!user && (
                <p className="text-sm text-center text-muted-foreground">
                  Already have an account? <button
                    onClick={() => setLocation(`/auth?return=/invite/${slug}`)}
                    className="text-primary hover:underline"
                  >
                    Log in
                  </button>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Organized by <span className="font-medium text-foreground">{circle.organizer.displayName}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, MapPin, Calendar, Share2, QrCode, TrendingUp, ArrowLeft } from "lucide-react";
import { UserProfileCard } from "@/components/user-profile-card";
import type { RoomWithOrganizer, ProfileWithUser, ActionWithUser, LeaderboardEntry } from "@shared/schema";

export default function RoomDetail() {
  const [, params] = useRoute("/app/rooms/:id");
  const roomId = params?.id;

  const { data: room, isLoading: roomLoading } = useQuery<RoomWithOrganizer>({
    queryKey: [`/api/rooms/${roomId}`],
    enabled: !!roomId,
  });

  const { data: participants, isLoading: participantsLoading } = useQuery<ProfileWithUser[]>({
    queryKey: ["/api/profiles", roomId],
    enabled: !!roomId,
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery<ActionWithUser[]>({
    queryKey: ["/api/actions", roomId],
    enabled: !!roomId,
  });

  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard"],
  });

  if (roomLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-96" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Room not found</h2>
          <Link href="/app/rooms">
            <Button>Back to Rooms</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-8">
          <div className="space-y-6">
            <Link href="/app/rooms">
              <Button variant="ghost" size="sm" data-testid="button-back-to-rooms">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Rooms
              </Button>
            </Link>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold">{room.name}</h1>
                  {room.isActive && <Badge variant="default">Active</Badge>}
                </div>
                {room.description && (
                  <p className="text-lg text-muted-foreground">{room.description}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm">
                  {room.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{room.location}</span>
                    </div>
                  )}
                  {room.eventDate && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(room.eventDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{room.participantCount || 0} participants</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" size="lg" data-testid="button-share-room">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Link href="/app/qr">
                  <Button size="lg" data-testid="button-my-qr">
                    <QrCode className="w-4 h-4 mr-2" />
                    My QR Code
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <Tabs defaultValue="participants" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="participants" data-testid="tab-participants">
                Participants
              </TabsTrigger>
              <TabsTrigger value="activity" data-testid="tab-activity">
                Activity
              </TabsTrigger>
              <TabsTrigger value="leaderboard" data-testid="tab-leaderboard">
                Leaderboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="participants" className="space-y-6">
              {participantsLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex gap-4">
                          <Skeleton className="w-16 h-16 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {participants && participants.map((participant) => (
                    <UserProfileCard key={participant.id} profile={participant} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              {activitiesLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <Skeleton className="w-12 h-12 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {activities && activities.map((activity) => (
                    <Card key={activity.id} data-testid={`activity-${activity.id}`}>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <Avatar>
                            <AvatarImage src={activity.user.photoURL || undefined} />
                            <AvatarFallback>
                              {activity.user.displayName.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{activity.user.displayName}</span>
                              <Badge variant="outline" className="text-xs">
                                {activity.actionType}
                              </Badge>
                            </div>
                            <p className="text-foreground">{activity.content}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(activity.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {activities && activities.length === 0 && (
                    <Card className="p-12">
                      <div className="text-center text-muted-foreground">
                        No activities yet. Be the first to post!
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-4">
              {leaderboardLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <Skeleton className="w-12 h-12 rounded-full" />
                          <Skeleton className="w-12 h-12 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <Skeleton className="h-8 w-16" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {leaderboard && leaderboard.map((entry) => (
                    <Card 
                      key={entry.userId} 
                      className={entry.rank <= 3 ? "border-primary/20" : ""}
                      data-testid={`leaderboard-${entry.rank}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 font-bold text-lg">
                            {entry.rank}
                          </div>
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={entry.photoURL || undefined} />
                            <AvatarFallback>
                              {entry.displayName.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-semibold text-lg">{entry.displayName}</p>
                            <p className="text-sm text-muted-foreground">
                              {entry.actionsThisWeek} actions this week
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 text-primary">
                              <TrendingUp className="w-5 h-5" />
                              <span className="text-2xl font-bold">{entry.currentStreak}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">day streak</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

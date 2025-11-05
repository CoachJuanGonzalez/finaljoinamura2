import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, MapPin, Calendar, Plus, Search, ArrowRight } from "lucide-react";
import type { RoomWithOrganizer } from "@shared/schema";

export default function Rooms() {
  const { data: rooms, isLoading } = useQuery<RoomWithOrganizer[]>({
    queryKey: ["/api/rooms"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-2">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-6 w-96" />
              </div>
              <Skeleton className="h-11 w-40" />
            </div>
            <Skeleton className="h-11 w-full" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Event Rooms</h1>
              <p className="text-lg text-muted-foreground">
                Join an event room to connect with other participants
              </p>
            </div>
            <Button size="lg" data-testid="button-create-room">
              <Plus className="w-4 h-4 mr-2" />
              Create Room
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="pl-10"
              data-testid="input-search-rooms"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms && rooms.map((room) => (
              <Card key={room.id} className="hover-elevate" data-testid={`card-room-${room.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl">{room.name}</CardTitle>
                    {room.isActive && (
                      <Badge variant="default" className="shrink-0">Active</Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {room.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
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

                  <Link href={`/app/rooms/${room.id}`}>
                    <Button className="w-full" data-testid={`button-join-room-${room.id}`}>
                      Join Room
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {rooms && rooms.length === 0 && (
            <Card className="p-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">No rooms found</h3>
                  <p className="text-muted-foreground">
                    Create a new room to start connecting with others
                  </p>
                </div>
                <Button size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Room
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

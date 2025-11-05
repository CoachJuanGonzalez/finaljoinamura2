import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus } from "lucide-react";

export function CreateCircleModal() {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    eventDate: "",
    capacity: "",
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/circles", {
        name: data.name,
        description: data.description || undefined,
        location: data.location || undefined,
        eventDate: data.eventDate || undefined,
        capacity: data.capacity ? parseInt(data.capacity) : undefined,
      });
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms"] });
      toast({
        title: "Circle created!",
        description: "Your circle is live. Share the invitation link to grow your flow.",
      });
      setOpen(false);
      setFormData({
        name: "",
        description: "",
        location: "",
        eventDate: "",
        capacity: "",
      });
      setLocation(`/app/rooms/${data.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create circle",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please log in to create a circle",
        variant: "destructive",
      });
      setLocation("/auth");
      return;
    }
    createMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-full" data-testid="button-open-create-circle">
          <Plus className="w-4 h-4 mr-2" />
          Open Circle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Open a New Circle</DialogTitle>
          <DialogDescription>
            Create an event space where connections become continuity.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Circle Name *</Label>
            <Input
              id="name"
              placeholder="BILLIONAIRE BOOTCAMP 2025"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              data-testid="input-circle-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="The ultimate networking experience for entrepreneurs..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              data-testid="input-circle-description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Bali, Indonesia"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                data-testid="input-circle-location"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="100"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                data-testid="input-circle-capacity"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventDate">Event Date</Label>
            <Input
              id="eventDate"
              type="datetime-local"
              value={formData.eventDate}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
              data-testid="input-circle-date"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-full"
              disabled={createMutation.isPending}
              data-testid="button-create-submit"
            >
              {createMutation.isPending ? "Creating..." : "Create Circle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

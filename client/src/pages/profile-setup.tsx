import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { insertProfileSchema, type Profile } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, X, ArrowRight, Loader2 } from "lucide-react";
import { z } from "zod";

const profileFormSchema = insertProfileSchema.extend({
  bio: z.string().optional(),
  role: z.string().optional(),
  company: z.string().optional(),
}).omit({ userId: true });

type ProfileFormData = z.infer<typeof profileFormSchema>;

export default function ProfileSetup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [links, setLinks] = useState<string[]>([""]);

  // For demo purposes, use a fixed demo user ID
  // In production, this would come from Firebase Auth
  const currentUserId = "user-1";

  // Check if profile already exists
  const { data: existingProfile } = useQuery<Profile>({
    queryKey: [`/api/profiles/user/${currentUserId}`],
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      offer: "",
      ask: "",
      links: [],
      bio: "",
      role: "",
      company: "",
      roomId: null,
    },
  });

  // Load existing profile data
  useEffect(() => {
    if (existingProfile) {
      form.reset({
        offer: existingProfile.offer,
        ask: existingProfile.ask,
        links: existingProfile.links,
        bio: existingProfile.bio || "",
        role: existingProfile.role || "",
        company: existingProfile.company || "",
        roomId: existingProfile.roomId,
      });
      setLinks(existingProfile.links.length > 0 ? existingProfile.links : [""]);
    }
  }, [existingProfile, form]);

  const createProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const profileData = {
        ...data,
        userId: currentUserId,
      };
      return await apiRequest("POST", "/api/profiles", profileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
      queryClient.invalidateQueries({ queryKey: [`/api/profiles/user/${currentUserId}`] });
      toast({
        title: "Profile created!",
        description: "Your profile has been created successfully.",
      });
      setLocation("/app/rooms");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create profile",
        variant: "destructive",
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      if (!existingProfile) throw new Error("No profile to update");
      return await apiRequest("PATCH", `/api/profiles/${existingProfile.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
      queryClient.invalidateQueries({ queryKey: [`/api/profiles/user/${currentUserId}`] });
      toast({
        title: "Profile updated!",
        description: "Your profile has been updated successfully.",
      });
      setLocation("/app/rooms");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const addLink = () => {
    setLinks([...links, ""]);
  };

  const removeLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
    form.setValue("links", newLinks.filter(link => link.trim() !== ""));
  };

  const updateLink = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
    form.setValue("links", newLinks.filter(link => link.trim() !== ""));
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (existingProfile) {
      updateProfileMutation.mutate(data);
    } else {
      createProfileMutation.mutate(data);
    }
  };

  const isPending = createProfileMutation.isPending || updateProfileMutation.isPending;

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Create Your Profile</h1>
          <p className="text-lg text-muted-foreground">
            Tell others what you offer and what you're looking for to make meaningful connections.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              This information will be visible to other event participants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Product Manager" 
                            {...field} 
                            value={field.value || ""}
                            data-testid="input-role"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Acme Inc." 
                            {...field} 
                            value={field.value || ""}
                            data-testid="input-company"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a bit about yourself..."
                          className="resize-none h-24"
                          {...field}
                          value={field.value || ""}
                          data-testid="input-bio"
                        />
                      </FormControl>
                      <FormDescription>
                        A brief introduction about yourself
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold">Offer & Ask</h3>
                  <p className="text-sm text-muted-foreground">
                    The core of meaningful networking - what you can offer and what you need
                  </p>

                  <FormField
                    control={form.control}
                    name="offer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What I Offer</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Product strategy advice, intro to VCs, design feedback..."
                            className="resize-none h-32"
                            {...field}
                            data-testid="input-offer"
                          />
                        </FormControl>
                        <FormDescription>
                          Share your expertise, connections, or resources you can provide
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ask"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What I Ask</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Looking for angel investors, need technical co-founder, seeking beta users..."
                            className="resize-none h-32"
                            {...field}
                            data-testid="input-ask"
                          />
                        </FormControl>
                        <FormDescription>
                          What you're looking for or need help with
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Links</h3>
                      <p className="text-sm text-muted-foreground">
                        Add your LinkedIn, Twitter, website, etc.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addLink}
                      data-testid="button-add-link"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Link
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {links.map((link, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="https://linkedin.com/in/yourname"
                          value={link}
                          onChange={(e) => updateLink(index, e.target.value)}
                          data-testid={`input-link-${index}`}
                        />
                        {links.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeLink(index)}
                            data-testid={`button-remove-link-${index}`}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1"
                    disabled={isPending}
                    data-testid="button-save-profile"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {existingProfile ? "Update" : "Save"} Profile
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

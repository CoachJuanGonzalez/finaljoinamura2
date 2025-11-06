import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Download, Share2, Copy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import QRCode from "qrcode";
import type { Profile } from "@shared/schema";

export default function QRCodePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/auth");
    }
  }, [authLoading, user, setLocation]);

  // Fetch user's profile
  const { data: profile, isLoading: profileLoading } = useQuery<Profile>({
    queryKey: [`/api/profiles/user/${user?.id}`],
    enabled: !!user?.id,
  });

  const profileUrl = user ? `${window.location.origin}/app/profile/${user.id}` : "";

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, profileUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
    }
  }, [profileUrl]);

  const handleDownload = () => {
    if (canvasRef.current && user) {
      const url = canvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `amura-qr-${user.displayName.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = url;
      link.click();
      
      toast({
        title: "QR Code Downloaded",
        description: "Your QR code has been saved to your device",
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Link Copied",
      description: "Profile link copied to clipboard",
    });
  };

  const handleShare = async () => {
    if (navigator.share && user) {
      try {
        await navigator.share({
          title: `Connect with ${user.displayName} on AMURA`,
          text: "Scan my QR code to connect!",
          url: profileUrl,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  // Show loading state while checking authentication
  if (authLoading || profileLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">My QR Code</h1>
          <p className="text-lg text-muted-foreground">
            Share this QR code with others to instantly exchange profiles
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Connection Code</CardTitle>
            <CardDescription>
              Others can scan this code to view your profile and connect with you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-6 py-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <canvas 
                  ref={canvasRef} 
                  className="rounded-lg"
                  data-testid="canvas-qr-code"
                />
              </div>

              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback className="text-lg">
                    {user.displayName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg" data-testid="text-user-name">
                    {user.displayName}
                  </p>
                  {profile?.role && profile?.company && (
                    <p className="text-sm text-muted-foreground" data-testid="text-user-role">
                      {profile.role} at {profile.company}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleDownload} 
                  size="lg" 
                  className="flex-1"
                  data-testid="button-download-qr"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
                <Button 
                  onClick={handleShare} 
                  variant="outline" 
                  size="lg" 
                  className="flex-1"
                  data-testid="button-share-qr"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              <Button 
                onClick={handleCopyLink} 
                variant="outline" 
                size="lg" 
                className="w-full"
                data-testid="button-copy-link"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Profile Link
              </Button>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border">
              <p className="text-sm text-muted-foreground break-all">
                {profileUrl}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold text-xs shrink-0">
                1
              </span>
              <p>Open the QR code on your phone or download and print it</p>
            </div>
            <div className="flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold text-xs shrink-0">
                2
              </span>
              <p>Have others scan your code with their phone camera</p>
            </div>
            <div className="flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold text-xs shrink-0">
                3
              </span>
              <p>They'll instantly see your profile and can connect with you</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, QrCode, TrendingUp, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import heroImage from "@assets/generated_images/Hero_networking_event_scene_3531463c.png";
import profileMockup from "@assets/generated_images/Profile_card_interface_mockup_fd0f7592.png";
import qrMockup from "@assets/generated_images/QR_code_mobile_interface_8cd05d59.png";
import feedMockup from "@assets/generated_images/Activity_feed_interface_design_6d64a974.png";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-background via-background to-accent/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <Badge className="inline-flex items-center gap-2 px-4 py-1.5" data-testid="badge-beta">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold uppercase tracking-wide">Event Networking Reimagined</span>
            </Badge>
            
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight" data-testid="text-hero-headline">
                Connect Meaningfully at Every Event
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-xl">
                Share what you offer, discover what others ask, and build real connections through instant QR networking.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/app">
                <Button size="lg" className="text-base px-8 py-6 h-auto" data-testid="button-join-event">
                  Join Event Room
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/app">
                <Button size="lg" variant="outline" className="text-base px-8 py-6 h-auto" data-testid="button-learn-more">
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span data-testid="text-social-proof">1,000+ connections made at 50+ events</span>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="People networking at event" 
                className="w-full h-auto"
                data-testid="img-hero"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-card/30" data-testid="section-how-it-works">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl lg:text-5xl font-bold">How ALIGN Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to transform how you network at events
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Users,
                title: "Create Your Profile",
                description: "Share what you offer and what you're looking for. Let others know how they can help you and how you can help them.",
                testId: "card-step-1"
              },
              {
                step: "02",
                icon: QrCode,
                title: "Connect via QR",
                description: "Generate your unique QR code. Scan others' codes to instantly exchange profiles and stay connected beyond the event.",
                testId: "card-step-2"
              },
              {
                step: "03",
                icon: TrendingUp,
                title: "Build Momentum",
                description: "Log daily actions, track your networking streak, and climb the leaderboard as you build meaningful relationships.",
                testId: "card-step-3"
              }
            ].map((item) => (
              <Card key={item.step} className="relative overflow-hidden hover-elevate" data-testid={item.testId}>
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-6xl font-bold text-primary/10">{item.step}</span>
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-7 h-7 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          {/* Feature 1: Profile & Offer/Ask */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src={profileMockup} 
                alt="Profile interface" 
                className="w-full h-auto rounded-2xl shadow-xl"
                data-testid="img-feature-profile"
              />
            </div>
            <div className="space-y-6">
              <Badge variant="outline">Core Feature</Badge>
              <h2 className="text-4xl lg:text-5xl font-bold">Offer & Ask Framework</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Make networking intentional. Clearly define what value you bring and what support you're seeking. 
                This simple framework creates authentic connections based on mutual value exchange.
              </p>
              <ul className="space-y-3">
                {["Share your expertise and skills", "Express your current needs", "Find complementary connections", "Build win-win relationships"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature 2: QR Connect */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 lg:order-1">
              <Badge variant="outline">Instant Connection</Badge>
              <h2 className="text-4xl lg:text-5xl font-bold">QR Code Networking</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Forget fumbling with business cards or typing contact info. Generate your unique QR code 
                and let others scan it to instantly connect. Fast, seamless, and perfect for busy events.
              </p>
              <ul className="space-y-3">
                {["Generate QR in seconds", "Scan to exchange profiles", "Auto-save connections", "Follow up effortlessly"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative lg:order-2">
              <img 
                src={qrMockup} 
                alt="QR code interface" 
                className="w-full h-auto rounded-2xl shadow-xl"
                data-testid="img-feature-qr"
              />
            </div>
          </div>

          {/* Feature 3: Activity & Leaderboard */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src={feedMockup} 
                alt="Activity feed" 
                className="w-full h-auto rounded-2xl shadow-xl"
                data-testid="img-feature-activity"
              />
            </div>
            <div className="space-y-6">
              <Badge variant="outline">Stay Engaged</Badge>
              <h2 className="text-4xl lg:text-5xl font-bold">Daily Actions & Streaks</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Turn networking into a habit. Log daily actions, maintain your streak, and compete on the 
                leaderboard. Gamification that drives real relationship building.
              </p>
              <ul className="space-y-3">
                {["Track networking activities", "Build consistency streaks", "See community progress", "Earn recognition"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold">Ready to Network Smarter?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of professionals making meaningful connections at events worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/app">
              <Button size="lg" className="text-base px-8 py-6 h-auto" data-testid="button-cta-join">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-card/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">ALIGN</h3>
              <p className="text-sm text-muted-foreground">
                Transforming event networking through intentional connections.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/app" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/app" className="hover:text-foreground transition-colors">How It Works</Link></li>
                <li><Link href="/app" className="hover:text-foreground transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/app" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="/app" className="hover:text-foreground transition-colors">Community</Link></li>
                <li><Link href="/app" className="hover:text-foreground transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/app" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/app" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="/app" className="hover:text-foreground transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 ALIGN. Built for meaningful connections.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

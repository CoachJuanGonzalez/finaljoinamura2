import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from "@/components/app-layout";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Auth from "@/pages/auth";
import ProfileSetup from "@/pages/profile-setup";
import Rooms from "@/pages/rooms";
import RoomDetail from "@/pages/room-detail";
import QRCodePage from "@/pages/qr-code";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/auth" component={Auth} />
      
      {/* App routes - wrapped in AppLayout */}
      <Route path="/app">
        {() => <Redirect to="/app/rooms" />}
      </Route>
      
      <Route path="/app/setup" component={ProfileSetup} />
      
      <Route path="/app/rooms">
        {() => (
          <AppLayout>
            <Rooms />
          </AppLayout>
        )}
      </Route>
      
      <Route path="/app/rooms/:id">
        {() => (
          <AppLayout>
            <RoomDetail />
          </AppLayout>
        )}
      </Route>
      
      <Route path="/app/profile">
        {() => (
          <AppLayout>
            <ProfileSetup />
          </AppLayout>
        )}
      </Route>
      
      <Route path="/app/qr">
        {() => (
          <AppLayout>
            <QRCodePage />
          </AppLayout>
        )}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

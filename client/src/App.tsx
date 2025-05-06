import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import SportsPage from "@/pages/sports-page";
import PromotionsPage from "@/pages/promotions-page";
import ContactPage from "@/pages/contact-page";
import AccountPage from "@/pages/account-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import AdminPage from "./pages/admin/admin-page";
import ManageEvents from "./pages/admin/manage-events";
import ManageUsers from "./pages/admin/manage-users";
import ManageBets from "./pages/admin/manage-bets";
import ManagePromotions from "./pages/admin/manage-promotions";
import { ThemeProvider } from "@/components/ui/theme-provider";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/sports" component={SportsPage} />
      <Route path="/promotions" component={PromotionsPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/account" component={AccountPage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      <ProtectedRoute path="/admin/events" component={ManageEvents} />
      <ProtectedRoute path="/admin/users" component={ManageUsers} />
      <ProtectedRoute path="/admin/bets" component={ManageBets} />
      <ProtectedRoute path="/admin/promotions" component={ManagePromotions} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

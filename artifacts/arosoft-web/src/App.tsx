import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Systems from "@/pages/Systems";
import Scripts from "@/pages/Scripts";
import Academy from "@/pages/Academy";
import Portfolio from "@/pages/Portfolio";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import Privacy from "@/pages/Privacy";
import AdminInbox from "@/pages/AdminInbox";
import Login from "@/pages/Login";
import DashboardPreview from "@/pages/DashboardPreview";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/systems" component={Systems} />
      <Route path="/scripts" component={Scripts} />
      <Route path="/academy" component={Academy} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/contact" component={Contact} />
      <Route path="/about" component={About} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/admin/inbox" component={AdminInbox} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard-preview" component={DashboardPreview} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

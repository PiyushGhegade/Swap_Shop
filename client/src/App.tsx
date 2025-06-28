import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ListingPage from "@/pages/listing-page";
import CreateListingPage from "@/pages/create-listing-page";
import ProfilePage from "@/pages/profile-page";
import MessagesPage from "@/pages/messages-page";
import HelpCenterPage from "@/pages/help-center-page";
import SafetyTipsPage from "@/pages/safety-tips-page";
import TermsOfServicePage from "@/pages/terms-of-service-page";
import PrivacyPolicyPage from "@/pages/privacy-policy-page";
import DeveloperTeamPage from "@/pages/ourdevelopers";
import CategoryPage from "@/pages/category-page";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import Layout from "./components/layout/layout";
import ProductDetailPage from "./pages/product-detail-page";
import ExplorePage from "@/pages/explore-page";

import SearchPage from "@/pages/search-page";




// useEffect(() => {
//   import("../test-fetch.ts");
// }, []);


function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/explore" component={ExplorePage} />

        <ProtectedRoute path="/create-listing" component={CreateListingPage} />
        <ProtectedRoute path="/profile" component={ProfilePage} />
        <ProtectedRoute path="/messages" component={MessagesPage} />
        <Route path="/helpCenter" component={HelpCenterPage} />
        <Route path="/safetyTips" component={SafetyTipsPage} />
        <Route path="/termsOfService" component={TermsOfServicePage} />
        <Route path="/privacyPolicy" component={PrivacyPolicyPage} />
        <ProtectedRoute path="/ourdevelopers" component={DeveloperTeamPage} />
        <Route path="/listing/:id" component={ProductDetailPage} />
        <Route path="/category" component={CategoryPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔄 Attempting to restore session from /api/auth/me");

    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          console.warn("⚠️ Not logged in. Token missing or invalid.");
          setUser(null);
          return;
        }
        const data = await res.json();
        console.log("✅ Session restored:", data.user);
        setUser(data.user);
      })
      .catch((err) => {
        console.error("❌ Failed to restore session:", err);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setUser]);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>🔄 Loading session...</p>
      </div>
    );
  }

  return <>{children}</>;
}

function App() {
  return (
    
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthWrapper>
          <Router />
          <Toaster />
        </AuthWrapper>
      </AuthProvider>
    </QueryClientProvider>
    
  );
}

export default App;

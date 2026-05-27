import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProjectsAdmin from "./pages/admin/Projects";
import TestimonialsAdmin from "./pages/admin/Testimonials";
import FounderAdmin from "./pages/admin/Founder";
import MessagesAdmin from "./pages/admin/Messages";
import MediaAdmin from "./pages/admin/Media";
import SettingsAdmin from "./pages/admin/Settings";
import SEOAdmin from "./pages/admin/SEO";
import ActivityAdmin from "./pages/admin/Activity";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<ProjectsAdmin />} />
              <Route path="testimonials" element={<TestimonialsAdmin />} />
              <Route path="founder" element={<FounderAdmin />} />
              <Route path="messages" element={<MessagesAdmin />} />
              <Route path="media" element={<MediaAdmin />} />
              <Route path="settings" element={<SettingsAdmin />} />
              <Route path="seo" element={<SEOAdmin />} />
              <Route path="activity" element={<ActivityAdmin />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

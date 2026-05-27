import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-background p-6 text-center">
        <div className="glass-card p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-gradient">Access Denied</h2>
          <p className="text-muted-foreground mb-4">
            Your account does not have admin privileges.
          </p>
          <a href="/" className="btn-glow inline-flex">Back to website</a>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

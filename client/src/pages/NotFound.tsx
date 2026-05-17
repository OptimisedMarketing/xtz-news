import { Link } from "wouter";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container py-24 text-center">
      <h1 className="text-8xl font-black mb-4" style={{ color: "var(--xtz-blue)" }}>404</h1>
      <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
      <p className="text-white/50 mb-8 max-w-sm mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="btn-primary">
        <Home size={14} /> Back to Home
      </Link>
    </div>
  );
}

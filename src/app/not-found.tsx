import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>
      
      <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-b from-white to-white/50">404</h1>
      <h2 className="text-2xl font-semibold mb-6">System Malfunction</h2>
      
      <p className="text-muted-foreground max-w-md mb-8">
        The digital asset you are looking for has been moved, deleted, or never existed in this dimension.
      </p>

      <Link href="/">
        <Button size="lg" className="font-bold">
          Return to Base
        </Button>
      </Link>
    </div>
  );
}

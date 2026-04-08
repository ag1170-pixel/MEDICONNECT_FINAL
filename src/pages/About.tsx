import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-6">About Us</h1>
        <p className="text-muted-foreground leading-relaxed mb-6">
          MediConnect helps patients find the right doctors and book appointments quickly.
          This demo UI is powered by a React + TypeScript frontend with optional Supabase integration.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => navigate("/search")}
            className="rounded-2xl"
          >
            Find Doctors
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/pricing")}
            className="rounded-2xl"
          >
            View Pricing
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}


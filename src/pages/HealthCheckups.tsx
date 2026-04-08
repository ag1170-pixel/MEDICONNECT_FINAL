import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function HealthCheckups() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-6">Health Checkups</h1>
        <p className="text-muted-foreground mb-8">
          Book lab tests and health checkups online with fast delivery and reliable results.
        </p>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Popular options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => navigate("/lab-tests")} className="rounded-2xl">
                Browse Lab Tests
              </Button>
              <Button variant="outline" onClick={() => navigate("/pricing")} className="rounded-2xl">
                View Pricing
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}


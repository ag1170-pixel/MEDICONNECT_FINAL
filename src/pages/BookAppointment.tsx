import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function BookAppointment() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-6">Book an Appointment</h1>
        <p className="text-muted-foreground mb-8">
          Choose a doctor, pick a time slot, and confirm your booking in minutes.
        </p>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Get started</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/search")} className="rounded-2xl">
              Search Doctors
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}


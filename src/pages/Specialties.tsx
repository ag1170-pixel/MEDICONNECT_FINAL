import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { mockSpecialties } from "@/data/mockData";
import { Users } from "lucide-react";

export default function Specialties() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-3">Specialties</h1>
          <p className="text-muted-foreground mb-8">
            Browse by department and find doctors matching your needs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSpecialties.map((s) => (
              <Card
                key={s.id}
                className="rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="rounded-full">
                      {s.name}
                    </Badge>
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  {s.description ? (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      {s.description}
                    </p>
                  ) : (
                    <div className="h-6" />
                  )}
                  <Button
                    onClick={() =>
                      navigate(`/search?specialty_id=${encodeURIComponent(String(s.id))}`)
                    }
                    className="rounded-2xl w-full"
                  >
                    Find Doctors
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


import { useState } from "react";
import { Check, Heart, Shield, Smartphone, Users, Zap, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubscribe = async (plan: string) => {
    try {
      setLoading(plan);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access your health dashboard.",
          variant: "destructive",
        });
        window.location.href = '/login';
        return;
      }

      // Redirect to health dashboard instead of payment
      toast({
        title: "Welcome to MediConnect!",
        description: "Start tracking your health metrics now.",
      });
      window.location.href = '/health-dashboard';
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      id: "essential",
      name: "Essential",
      price: 2320,
      description: "Perfect for individuals starting their health journey",
      badge: null,
      features: [
        "Fashionable Smart Band (Gen Z Style)",
        "6 Core Health Metrics Tracking",
        "Basic Real-time Monitoring",
        "Mobile App Access", 
        "Weekly Health Reports",
        "Community Support"
      ],
      cta: "Start Your Health Journey"
    },
    {
      id: "premium", 
      name: "Premium",
      price: 3920,
      description: "Complete health management with doctor connectivity",
      badge: "Most Popular",
      features: [
        "Everything in Essential",
        "Instant Doctor Alerts & Notifications",
        "Advanced Health Analytics & Trends",
        "24/7 Emergency SOS Feature",
        "Priority Doctor Consultation Booking",
        "Family Health Sharing",
        "Personalized Health Recommendations",
        "Sleep Quality Analysis"
      ],
      cta: "Get Premium Care"
    },
    {
      id: "family",
      name: "Family Plan", 
      price: 6320,
      description: "Complete health protection for your entire family",
      badge: "Best Value",
      features: [
        "Everything in Premium",
        "Up to 4 Smart Bands Included",
        "Family Health Dashboard",
        "Multi-user Doctor Alerts",
        "Family Emergency Contacts",
        "Bulk Doctor Consultation Credits",
        "Advanced Family Analytics",
        "Priority Customer Support"
      ],
      cta: "Protect Your Family"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-light/40 via-primary-light/20 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
              Revolutionary Health Technology
            </Badge>
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Your Health, <span className="text-primary">Redefined</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              MediConnect isn't just a health band – it's your personal health guardian. 
              Stylish enough for Gen Z, smart enough for doctors, reliable enough for emergencies.
            </p>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why MediConnect Changes Everything</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              More than monitoring – it's proactive healthcare that saves time, money, and lives.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Fashion Meets Function</h3>
              <p className="text-muted-foreground">
                Designed for Gen Z aesthetics. Wear it as your daily accessory while it silently guards your health 24/7.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Saves Doctors Time</h3>
              <p className="text-muted-foreground">
                Real-time data means doctors spend less time diagnosing and more time treating. Faster appointments, better outcomes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Peace of Mind</h3>
              <p className="text-muted-foreground">
                Your health data + SOS feature = knowing help is always one tap away. Priceless confidence for you and your family.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Health Plan</h2>
            <p className="text-muted-foreground">
              Unlock the full potential of your MediConnect band with our subscription plans
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={plan.id} 
                className={`relative rounded-2xl ${
                  plan.badge === "Most Popular" 
                    ? "border-primary shadow-lg scale-105" 
                    : "border-border"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-foreground">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground mt-2">
                    {plan.description}
                  </CardDescription>
                   <div className="mt-6">
                     <span className="text-4xl font-bold text-foreground">Rs.{plan.price}</span>
                     <span className="text-muted-foreground">/month</span>
                   </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full rounded-2xl h-12 text-base font-medium hover:scale-105 transition-all duration-200"
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading === plan.id}
                    variant={plan.badge === "Most Popular" ? "default" : "outline"}
                  >
                    {loading === plan.id ? "Processing..." : plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Health Metrics */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">6 Critical Health Metrics</h2>
            <p className="text-muted-foreground">
              Advanced sensors track what matters most for your health
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { icon: Heart, name: "Heart Rate", desc: "Continuous BPM monitoring" },
              { icon: Shield, name: "Blood Pressure", desc: "Hypertension alerts" },
              { icon: Zap, name: "SpO2 Levels", desc: "Oxygen saturation tracking" },
              { icon: Users, name: "Sleep Quality", desc: "REM & deep sleep analysis" },
              { icon: AlertTriangle, name: "Stress Levels", desc: "Mental wellness tracking" },
              { icon: Smartphone, name: "Activity", desc: "Steps, calories, distance" }
            ].map((metric, index) => (
              <Card key={index} className="p-6 text-center rounded-2xl">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <metric.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{metric.name}</h3>
                <p className="text-sm text-muted-foreground">{metric.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency SOS */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-warning/10 to-destructive/10 rounded-3xl p-8 md:p-12 text-center">
            <AlertTriangle className="h-16 w-16 text-warning mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-4">Emergency SOS Feature</h2>
            <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
              Critical health events detected? Your band instantly alerts your emergency contacts AND your doctor. 
              Because every second counts in a health emergency.
            </p>
            <Badge className="bg-warning/10 text-warning">
              Potentially Life-Saving Technology
            </Badge>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
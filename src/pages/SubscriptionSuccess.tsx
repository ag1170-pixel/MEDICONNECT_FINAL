import { useEffect, useState } from "react";
import { CheckCircle, Heart, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SubscriptionSuccess() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Wait a moment then refresh subscription status
      setTimeout(() => {
        refreshSubscription();
      }, 2000);
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const refreshSubscription = async () => {
    try {
      // Mock subscription refresh - no actual Supabase call needed
      console.log('Mock subscription refresh');
    } catch (error) {
      console.error('Error refreshing subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          
          {/* Success Animation */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome to MediConnect!
            </h1>
            <p className="text-xl text-muted-foreground">
              Your subscription is now active and your health journey begins today
            </p>
          </div>

          {/* Success Card */}
          <Card className="rounded-3xl p-8 mb-8">
            <CardContent className="space-y-6">
              {loading ? (
                <div className="py-8">
                  <div className="text-lg text-muted-foreground">
                    Activating your subscription...
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-left space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">What happens next?</h2>
                    
                    <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-2xl">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sm font-bold text-primary">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Smart Band Shipping</h3>
                        <p className="text-muted-foreground">Your fashionable MediConnect band ships within 24-48 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-2xl">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sm font-bold text-primary">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">App Setup</h3>
                        <p className="text-muted-foreground">Download the MediConnect app and pair your band for instant health monitoring</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-2xl">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sm font-bold text-primary">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Doctor Connection</h3>
                        <p className="text-muted-foreground">Connect with your doctor for real-time health alerts and better care</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-success/10 to-primary/10 rounded-2xl p-6">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <Heart className="h-6 w-6 text-primary" />
                      <Smartphone className="h-6 w-6 text-success" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Your Health, Redefined
                    </h3>
                    <p className="text-muted-foreground">
                      Join thousands who've transformed their health journey with MediConnect's smart monitoring
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="rounded-2xl px-8 py-3"
              onClick={() => navigate('/account')}
            >
              View My Account
            </Button>
            <Button 
              variant="outline" 
              className="rounded-2xl px-8 py-3"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>

          {/* Support Note */}
          <div className="mt-12 p-6 bg-muted/50 rounded-2xl">
            <p className="text-muted-foreground">
              Questions about your subscription or need help setting up? 
              <br />
              Contact our support team at{" "}
              <span className="text-primary font-medium">support@mediconnect.com</span>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
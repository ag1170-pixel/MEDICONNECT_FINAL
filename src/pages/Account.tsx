import { useState, useEffect } from "react";
import { User, Settings, CreditCard, Bell, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

export default function Account() {
  const { user, signOut } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData>({ subscribed: false });
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkSubscription();
  }, [user]);

  const checkSubscription = async () => {
    try {
      setLoading(true);
      
      // Mock subscription data
      const mockSubscription = {
        subscribed: true,
        subscription_tier: 'Premium',
        subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      setSubscription(mockSubscription);
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    try {
      setPortalLoading(true);
      toast({
        title: "Billing Portal",
        description: "This would open the billing portal in a real application.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open billing portal.",
        variant: "destructive",
      });
    } finally {
      setPortalLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signed out successfully",
          description: "You have been logged out of your account.",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Sign out failed", 
        description: "An error occurred while signing out.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-lg">Loading your account...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Account Header */}
      <section className="bg-gradient-to-br from-primary-light/40 via-primary-light/20 to-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Account Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your MediConnect subscription and health data
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Profile Card */}
          <Card className="lg:col-span-1 rounded-2xl">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-xl">{user?.email}</CardTitle>
              <CardDescription>MediConnect Member</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full rounded-2xl"
                onClick={() => navigate('/pricing')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage Subscription
              </Button>
              <Button 
                variant="outline" 
                className="w-full rounded-2xl"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Subscription Details */}
          <Card className="lg:col-span-2 rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Subscription Status</CardTitle>
                  <CardDescription>Your current MediConnect plan</CardDescription>
                </div>
                {subscription.subscribed && (
                  <Badge className="bg-success/10 text-success">
                    Active
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {subscription.subscribed ? (
                <div className="space-y-6">
                  {/* Current Plan */}
                  <div className="p-6 bg-muted/50 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">
                          MediConnect {subscription.subscription_tier}
                        </h3>
                        <p className="text-muted-foreground">
                          Your subscription renews on {subscription.subscription_end && new Date(subscription.subscription_end).toLocaleDateString()}
                        </p>
                      </div>
                      <Heart className="h-8 w-8 text-primary" />
                    </div>
                    
                    {/* Plan Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-primary" />
                        <span className="text-sm">24/7 Health Monitoring</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-primary" />
                        <span className="text-sm">Doctor Alert System</span>
                      </div>
                      {subscription.subscription_tier === "Premium" && (
                        <>
                          <div className="flex items-center gap-3">
                            <Heart className="h-5 w-5 text-primary" />
                            <span className="text-sm">Advanced Analytics</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-primary" />
                            <span className="text-sm">Emergency SOS</span>
                          </div>
                        </>
                      )}
                      {subscription.subscription_tier === "Family" && (
                        <>
                          <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-primary" />
                            <span className="text-sm">Family Dashboard</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-primary" />
                            <span className="text-sm">4 Smart Bands Included</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Manage Subscription */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      className="rounded-2xl"
                      onClick={openCustomerPortal}
                      disabled={portalLoading}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      {portalLoading ? "Opening..." : "Manage Billing"}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-2xl"
                      onClick={checkSubscription}
                    >
                      Refresh Status
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No Active Subscription
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Subscribe to unlock your MediConnect band's full potential
                  </p>
                  <Button 
                    className="rounded-2xl"
                    onClick={() => navigate('/pricing')}
                  >
                    View Plans
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
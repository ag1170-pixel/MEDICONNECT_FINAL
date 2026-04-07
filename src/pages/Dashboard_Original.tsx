import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, User, Settings, LogOut, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
// import { useAuth } from "@/hooks/useAuth"; // Disabled Supabase Auth
import { useToast } from "@/hooks/use-toast";
import { mockDoctors } from "@/data/mockData";
import { Appointment } from "@/types";
import { format } from "date-fns";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  // const { user, loading, signOut } = useAuth(); // Disabled Supabase Auth
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock appointments data
    const mockAppointments: Appointment[] = [
      {
        id: "1",
        doctor_id: "1",
        doctor: mockDoctors[0],
        patient_name: "John Doe",
        patient_phone: "+91 9876543210",
        appointment_date: "2024-01-15",
        appointment_time: "10:00 AM",
        status: "upcoming",
        fees: 800,
        booking_date: "2024-01-10",
      },
      {
        id: "2",
        doctor_id: "2",
        doctor: mockDoctors[1],
        patient_name: "John Doe",
        patient_phone: "+91 9876543210",
        appointment_date: "2024-01-20",
        appointment_time: "02:30 PM",
        status: "upcoming",
        fees: 600,
        booking_date: "2024-01-12",
      },
      {
        id: "3",
        doctor_id: "3",
        doctor: mockDoctors[2],
        patient_name: "John Doe",
        patient_phone: "+91 9876543210",
        appointment_date: "2024-01-05",
        appointment_time: "11:00 AM",
        status: "completed",
        fees: 900,
        booking_date: "2024-01-02",
      },
    ];

      setAppointments(mockAppointments);
      setIsLoading(false);
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/", { replace: true });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      // Mock cancellation
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: 'cancelled' as const }
            : apt
        )
      );
      
      toast({
        title: "Appointment cancelled",
        description: "Your appointment has been cancelled successfully.",
      });
    } catch (error) {
      toast({
        title: "Cancellation failed",
        description: "Unable to cancel appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming');
  const pastAppointments = appointments.filter(apt => ['completed', 'cancelled'].includes(apt.status));

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <p>Loading dashboard...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Manage your appointments and profile</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Profile */}
          <div className="lg:col-span-1">
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src="" alt="User" />
                     <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                       {user?.user_metadata?.full_name ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'U'}
                     </AvatarFallback>
                  </Avatar>
                   <h3 className="font-semibold text-lg">{user?.user_metadata?.full_name || 'User'}</h3>
                   <p className="text-muted-foreground">{user?.email}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>+91 9876543210</span>
                  </div>
                   <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                     <Mail className="h-4 w-4" />
                     <span>{user?.email}</span>
                   </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start rounded-2xl">
                    <Settings className="h-4 w-4 mr-2" />
                    Profile Settings
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start rounded-2xl text-destructive hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{upcomingAppointments.length}</div>
                  <div className="text-muted-foreground">Upcoming Appointments</div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-6 w-6 text-success" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {pastAppointments.filter(apt => apt.status === 'completed').length}
                  </div>
                  <div className="text-muted-foreground">Completed Visits</div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-6 w-6 text-warning" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {new Set(appointments.map(apt => apt.doctor_id)).size}
                  </div>
                  <div className="text-muted-foreground">Doctors Visited</div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Appointments */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                    <Button onClick={() => navigate('/search')} className="rounded-2xl">
                      Book an Appointment
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 rounded-2xl border"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={appointment.doctor.profile_image} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {appointment.doctor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <h4 className="font-semibold">Dr. {appointment.doctor.name}</h4>
                            <p className="text-sm text-muted-foreground">{appointment.doctor.specialty}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{format(new Date(appointment.appointment_date), 'MMM dd, yyyy')}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{appointment.appointment_time}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-success border-success">
                            Confirmed
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-2xl"
                            onClick={() => handleCancelAppointment(appointment.id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Past Appointments */}
            {pastAppointments.length > 0 && (
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Past Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pastAppointments.slice(0, 5).map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 rounded-2xl border"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={appointment.doctor.profile_image} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {appointment.doctor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <h4 className="font-semibold">Dr. {appointment.doctor.name}</h4>
                            <p className="text-sm text-muted-foreground">{appointment.doctor.specialty}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{format(new Date(appointment.appointment_date), 'MMM dd, yyyy')}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{appointment.appointment_time}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Badge 
                          variant={appointment.status === 'completed' ? 'default' : 'secondary'}
                          className={
                            appointment.status === 'completed' 
                              ? 'bg-success text-success-foreground'
                              : ''
                          }
                        >
                          {appointment.status === 'completed' ? 'Completed' : 'Cancelled'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
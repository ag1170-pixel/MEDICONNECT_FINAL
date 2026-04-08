import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { Calendar, Clock, User, Phone, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { mockDoctors, mockTimeSlots } from "@/data/mockData";
import { format, addDays, parseISO } from "date-fns";
import { addAppointment } from "@/services/appointmentsStorage";

type BookingStep = 'slots' | 'details' | 'confirmation' | 'success';

export default function BookingFlow() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  
  const [currentStep, setCurrentStep] = useState<BookingStep>('slots');
  const initialDateParam = searchParams.get("date");
  const initialTimeParam = searchParams.get("time");

  const [selectedDate, setSelectedDate] = useState(() => {
    if (!initialDateParam) return new Date();
    try {
      return parseISO(initialDateParam);
    } catch {
      return new Date();
    }
  });
  const [selectedTime, setSelectedTime] = useState(() => initialTimeParam || "");

  const userFullName =
    user?.user_metadata?.full_name || user?.full_name || user?.email?.split("@")[0] || "";
  const userPhone = user?.user_metadata?.phone || user?.phone || "";

  const [patientName, setPatientName] = useState(() => userFullName);
  const [patientPhone, setPatientPhone] = useState(() => userPhone);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');

  const doctor = mockDoctors.find(d => d.id === doctorId);

  useEffect(() => {
    // If user is loaded after initial render, prefill patient details (but don't override edits).
    if (userFullName && !patientName) setPatientName(userFullName);
    if (userPhone && !patientPhone) setPatientPhone(userPhone);
  }, [patientName, patientPhone, userFullName, userPhone]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
      return;
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Keep the booking form in sync with the doctor-profile selected date/time.
    if (initialDateParam) {
      try {
        setSelectedDate(parseISO(initialDateParam));
      } catch {
        // Ignore invalid date params.
      }
    }
    setSelectedTime(initialTimeParam || "");
  }, [doctorId, initialDateParam, initialTimeParam]);

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Doctor not found</h1>
          <Link to="/search">
            <Button className="rounded-2xl">Back to Search</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  const availableSlots = mockTimeSlots.filter(slot => slot.available);

  const handleSlotSelection = () => {
    if (!selectedTime) {
      toast({
        title: "Please select a time slot",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep('details');
  };

  const handleBookingSubmit = async () => {
    if (!patientName || !patientPhone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[6-9]\d{9}$/.test(patientPhone.replace(/\D/g, ''))) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid Indian phone number.",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep('confirmation');
  };

  const confirmBooking = async () => {
    setIsLoading(true);
    
    try {
      // Mock booking API call
      const mockBookingId = 'BK' + Date.now();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const appointment = {
        id: mockBookingId,
        doctor_id: doctor.id,
        doctor,
        patient_name: patientName,
        patient_phone: patientPhone,
        appointment_date: format(selectedDate, "yyyy-MM-dd"),
        appointment_time: selectedTime,
        status: "upcoming" as const,
        fees: doctor.fees,
        booking_date: new Date().toISOString(),
      };

      addAppointment(appointment);
      setBookingId(mockBookingId);
      setCurrentStep('success');
      
      toast({
        title: "Appointment booked successfully!",
        description: `Your booking ID is ${mockBookingId}`,
      });
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "Unable to book appointment. Please try again.",
        variant: "destructive",
      });
      setCurrentStep('details');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'slots':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Select Date</h3>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
                {dates.map((date) => (
                  <Button
                    key={date.toISOString()}
                    variant={
                      format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                        ? "default"
                        : "outline"
                    }
                    onClick={() => setSelectedDate(date)}
                    className="rounded-2xl flex flex-col py-4 h-auto"
                  >
                    <span className="text-xs">{format(date, 'EEE')}</span>
                    <span className="text-sm font-semibold">{format(date, 'dd')}</span>
                    <span className="text-xs">{format(date, 'MMM')}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Select Time</h3>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    onClick={() => setSelectedTime(slot.time)}
                    className="rounded-2xl"
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSlotSelection} className="rounded-2xl">
                Continue
              </Button>
            </div>
          </div>
        );

      case 'details':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Patient Details</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="patientName">Patient Name *</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="patientName"
                      type="text"
                      placeholder="Enter patient name"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="pl-10 rounded-2xl"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="patientPhone">Phone Number *</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="patientPhone"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="pl-10 rounded-2xl"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    We'll send appointment confirmation to this number
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep('slots')}
                className="rounded-2xl"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleBookingSubmit} className="rounded-2xl">
                Review Booking
              </Button>
            </div>
          </div>
        );

      case 'confirmation':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Confirm Your Booking</h3>
              
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-2xl p-4">
                  <h4 className="font-medium mb-2">Appointment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{format(selectedDate, 'EEEE, MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span>{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Patient:</span>
                      <span>{patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{patientPhone}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-2xl p-4">
                  <h4 className="font-medium mb-2">Fee Details</h4>
                  <div className="flex justify-between items-center">
                    <span>Consultation Fee</span>
                    <span className="text-lg font-semibold">₹{doctor.fees}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep('details')}
                className="rounded-2xl"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={confirmBooking} 
                disabled={isLoading}
                className="rounded-2xl"
              >
                {isLoading ? "Booking..." : "Confirm & Book"}
              </Button>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h3>
              <p className="text-muted-foreground">
                Your appointment has been successfully booked
              </p>
            </div>

            <div className="bg-success-light rounded-2xl p-6">
              <h4 className="font-semibold mb-4">Appointment Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Booking ID:</span>
                  <span className="font-mono font-semibold">{bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Doctor:</span>
                  <span>Dr. {doctor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span>{format(selectedDate, 'MMM dd, yyyy')} at {selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Patient:</span>
                  <span>{patientName}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={() => navigate('/dashboard')} className="w-full rounded-2xl">
                View in Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/search')}
                className="w-full rounded-2xl"
              >
                Book Another Appointment
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        {currentStep !== 'success' && (
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 max-w-md mx-auto">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold ${
                ['slots', 'details', 'confirmation'].includes(currentStep) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                1
              </div>
              <div className={`h-0.5 w-12 ${
                ['details', 'confirmation'].includes(currentStep) ? 'bg-primary' : 'bg-muted'
              }`} />
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold ${
                ['details', 'confirmation'].includes(currentStep) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                2
              </div>
              <div className={`h-0.5 w-12 ${
                currentStep === 'confirmation' ? 'bg-primary' : 'bg-muted'
              }`} />
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold ${
                currentStep === 'confirmation' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                3
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Doctor Info Sidebar */}
            <div className="lg:col-span-1">
              <Card className="rounded-2xl sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarImage src={doctor.profile_image} alt={doctor.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg">Dr. {doctor.name}</h3>
                    <Badge variant="secondary" className="rounded-full">
                      {doctor.specialty}
                    </Badge>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Experience:</span>
                      <span>{doctor.years_experience} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Clinic:</span>
                      <span>{doctor.clinic_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">City:</span>
                      <span>{doctor.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Consultation Fee:</span>
                      <span className="font-semibold">₹{doctor.fees}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>
                    {currentStep === 'slots' && 'Select Appointment Slot'}
                    {currentStep === 'details' && 'Enter Patient Details'}
                    {currentStep === 'confirmation' && 'Confirm Your Booking'}
                    {currentStep === 'success' && 'Booking Confirmed!'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {renderStepContent()}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
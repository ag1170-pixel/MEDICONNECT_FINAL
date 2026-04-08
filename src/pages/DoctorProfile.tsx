import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, MapPin, Clock, IndianRupee, Calendar, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { mockTimeSlots } from "@/data/mockData";
import { loadDoctorsFromCsv } from "@/data/doctorsCsv";
import { format, addDays } from "date-fns";
import { Doctor } from "@/types";

export default function DoctorProfile() {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [allDoctors] = useState<Doctor[]>(() => loadDoctorsFromCsv());
  
  const doctor = allDoctors.find(d => d.id === id);

  useEffect(() => {
    setSelectedDate(new Date());
    setSelectedTime("");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);
  
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Doctor Header */}
        <Card className="rounded-2xl shadow-lg mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Doctor Avatar & Basic Info */}
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={doctor.profile_image} alt={doctor.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold text-foreground mb-2">Dr. {doctor.name}</h1>
                  <Badge variant="secondary" className="text-base px-4 py-1 rounded-full mb-4">
                    {doctor.specialty}
                  </Badge>
                  
                  <div className="flex items-center justify-center md:justify-start space-x-4 text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{doctor.rating}</span>
                      <span className="text-sm">({doctor.reviews_count} reviews)</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4" />
                      <span>{doctor.years_experience} years exp.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinic & Fee Info */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Clinic Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <div>
                          <p className="font-medium text-foreground">{doctor.clinic_name}</p>
                          <p className="text-sm">{doctor.city}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-4">Consultation Fee</h3>
                    <div className="flex items-center space-x-2 text-3xl font-bold text-primary mb-4">
                      <IndianRupee className="h-6 w-6" />
                      <span>{doctor.fees}</span>
                    </div>
                    
                    <div className="space-y-2">
                      {doctor.available_today && (
                        <Badge variant="outline" className="text-success border-success">
                          Available Today
                        </Badge>
                      )}
                      {doctor.available_tomorrow && (
                        <Badge variant="outline" className="text-primary border-primary">
                          Available Tomorrow
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link to={`/book/${doctor.id}`}>
                    <Button size="lg" className="rounded-2xl px-8">
                      <Calendar className="h-5 w-5 mr-2" />
                      Book Appointment
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* About Doctor */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>About Dr. {doctor.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {doctor.bio}
                </p>
              </CardContent>
            </Card>

            {/* Specializations */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Specializations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-full">
                    {doctor.specialty}
                  </Badge>
                  <Badge variant="secondary" className="rounded-full">
                    General Consultation
                  </Badge>
                  <Badge variant="secondary" className="rounded-full">
                    Preventive Care
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Education & Experience */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Education & Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground">Experience</h4>
                  <p className="text-muted-foreground">{doctor.years_experience}+ years in {doctor.specialty}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-foreground">Education</h4>
                  <p className="text-muted-foreground">MBBS, MD - {doctor.specialty}</p>
                  <p className="text-muted-foreground text-sm">AIIMS, New Delhi</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available Slots */}
          <div>
            <Card className="rounded-2xl sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Available Slots</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date Selection */}
                <div>
                  <h4 className="font-medium mb-3">Select Date</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {dates.slice(0, 6).map((date) => (
                      <Button
                        key={date.toISOString()}
                        variant={selectedDate.toDateString() === date.toDateString() ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDate(date)}
                        className="rounded-2xl flex flex-col py-3 h-auto"
                      >
                        <span className="text-xs">{format(date, 'EEE')}</span>
                        <span className="text-sm font-semibold">{format(date, 'dd MMM')}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <h4 className="font-medium mb-3">Available Times</h4>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant={selectedTime === slot.time ? "default" : "outline"}
                        size="sm"
                        className="rounded-2xl text-xs"
                        onClick={() => setSelectedTime(slot.time)}
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/book/${doctor.id}?date=${encodeURIComponent(
                    format(selectedDate, "yyyy-MM-dd")
                  )}&time=${encodeURIComponent(selectedTime || "")}`}
                  className="block w-full"
                >
                  <Button className="w-full rounded-2xl">
                    Book Appointment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
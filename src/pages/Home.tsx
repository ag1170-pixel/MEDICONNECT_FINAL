import { useState, useEffect } from "react";
import { Search, MapPin, Users, Award, Shield, Pill, FlaskConical, Truck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { Autocomplete } from "@/components/ui/autocomplete";
import { fetchSpecialties, fetchDoctors } from "@/services/mockService";
import { indianStates, doctorSpecialties } from "@/data/indianStates";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [topDoctors, setTopDoctors] = useState<any[]>([]);
  const [featuredSpecialties, setFeaturedSpecialties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [doctorsData, specialtiesData] = await Promise.all([
          fetchDoctors(),
          fetchSpecialties()
        ]);
        setTopDoctors(doctorsData.slice(0, 3));
        setFeaturedSpecialties(specialtiesData.slice(0, 8));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (selectedCity) params.append('city', selectedCity);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-light/40 via-primary-light/20 to-background py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-success/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Find & Book the Best Doctors
              <span className="text-primary block mt-2">Near You</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with top-rated doctors across India. Book appointments instantly and get the healthcare you deserve.
            </p>

            {/* Search Widget */}
            <Card className="p-6 max-w-3xl mx-auto shadow-lg rounded-2xl bg-card/80 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Autocomplete
                  value={selectedCity}
                  onChange={setSelectedCity}
                  suggestions={indianStates}
                  placeholder="Enter city or state"
                  className="rounded-2xl"
                  icon={<MapPin className="h-4 w-4" />}
                />
                <Autocomplete
                  value={searchQuery}
                  onChange={setSearchQuery}
                  suggestions={doctorSpecialties}
                  placeholder="Search doctors or specialties"
                  className="rounded-2xl"
                  icon={<Search className="h-4 w-4" />}
                />
                <Button 
                  onClick={handleSearch} 
                  className="rounded-2xl h-12 text-base font-medium hover:bg-primary-hover hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Search Doctors
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Healthcare Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Complete Healthcare Services</h2>
            <p className="text-muted-foreground">Authentic medicines and trusted lab tests delivered to your doorstep</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Medicine Card */}
            <Card className="rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  onClick={() => navigate('/medicine')}>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Pill className="h-8 w-8 text-green-600" />
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-200">
                    100% Authentic
                  </Badge>
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-3">Online Pharmacy</h3>
                <p className="text-muted-foreground mb-6">
                  Order medicines online with prescription upload. FDA approved pharmacy with quality assurance and fast delivery.
                </p>
                
                <Button className="w-full rounded-2xl bg-green-600 hover:bg-green-700 text-white">
                  Shop Medicines
                </Button>
              </CardContent>
            </Card>

            {/* Lab Tests Card */}
            <Card className="rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  onClick={() => navigate('/lab-tests')}>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FlaskConical className="h-8 w-8 text-blue-600" />
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200">
                    NABL Certified
                  </Badge>
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-3">Lab Tests & Checkups</h3>
                <p className="text-muted-foreground mb-6">
                  Book lab tests online with home sample collection. NABL certified labs with accurate and fast reports.
                </p>
                
                <Button className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white">
                  Book Lab Tests
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Specialties */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Browse by Specialty</h2>
            <p className="text-muted-foreground">Find doctors by their area of expertise</p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading specialties...</p>
            </div>
          ) : featuredSpecialties.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredSpecialties.map((specialty) => (
                <Card 
                  key={specialty.id} 
                  className="rounded-2xl hover:shadow-md transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/search?specialty_id=${specialty.id}`)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{specialty.name}</h3>
                    <p className="text-sm text-muted-foreground">{specialty.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No specialties available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Top Rated Doctors */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Top Rated Doctors</h2>
            <p className="text-muted-foreground">Highly recommended doctors trusted by thousands of patients</p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading doctors...</p>
            </div>
          ) : topDoctors.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>

              <div className="text-center mt-8">
                <Button 
                  variant="outline" 
                  className="rounded-2xl"
                  onClick={() => navigate('/search')}
                >
                  View All Doctors
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No doctors available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

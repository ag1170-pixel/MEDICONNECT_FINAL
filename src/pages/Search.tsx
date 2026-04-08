import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Star, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { mockSpecialties } from "@/data/mockData";
import { getUniqueCities, getUniqueStates, loadDoctorsFromCsv } from "@/data/doctorsCsv";
import { Doctor } from "@/types";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [allDoctors] = useState<Doctor[]>(() => loadDoctorsFromCsv());
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(allDoctors);
  const [states] = useState<string[]>(() => getUniqueStates(allDoctors));
  const [cities] = useState<string[]>(() => getUniqueCities(allDoctors));
  const initialStateParam = searchParams.get("state") || "";
  const initialCityParam = searchParams.get("city") || "";
  const cityParamIsState = Boolean(
    initialCityParam &&
      allDoctors.some(
        (doctor) => (doctor.state || "").toLowerCase() === initialCityParam.toLowerCase()
      )
  );

  // Filter states
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedState, setSelectedState] = useState(
    initialStateParam || (cityParamIsState ? initialCityParam : "all")
  );
  const [selectedCity, setSelectedCity] = useState(cityParamIsState ? "all" : (initialCityParam || "all"));
  const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams.get('specialty_id') || 'all');
  const [feeRange, setFeeRange] = useState([0, 2000]);
  const [minRating, setMinRating] = useState(0);
  const [availability, setAvailability] = useState('any');
  const [sortBy, setSortBy] = useState('rating');
  const stateScopedCities = selectedState && selectedState !== "all"
    ? Array.from(
        new Set(
          allDoctors
            .filter((doctor) => (doctor.state || "").toLowerCase() === selectedState.toLowerCase())
            .map((doctor) => doctor.city)
            .filter((city) => Boolean(city && city.trim()))
        )
      ).sort((a, b) => a.localeCompare(b))
    : cities;

  useEffect(() => {
    // Filter doctors based on current filters
    let filtered = [...allDoctors];

    if (query) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(query.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(query.toLowerCase()) ||
        doctor.city.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (selectedState && selectedState !== 'all') {
      filtered = filtered.filter((doctor) =>
        (doctor.state || "").toLowerCase() === selectedState.toLowerCase()
      );
    }

    if (selectedCity && selectedCity !== 'all') {
      filtered = filtered.filter(doctor => 
        doctor.city.toLowerCase() === selectedCity.toLowerCase()
      );
    }

    if (selectedSpecialty && selectedSpecialty !== 'all') {
      filtered = filtered.filter(doctor => 
        doctor.specialty_id === parseInt(selectedSpecialty)
      );
    }

    if (feeRange) {
      filtered = filtered.filter(doctor => 
        doctor.fees >= feeRange[0] && doctor.fees <= feeRange[1]
      );
    }

    if (minRating > 0) {
      filtered = filtered.filter(doctor => doctor.rating >= minRating);
    }

    if (availability === 'today') {
      filtered = filtered.filter(doctor => doctor.available_today);
    } else if (availability === 'tomorrow') {
      filtered = filtered.filter(doctor => doctor.available_tomorrow);
    }

    // Sort results
    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'fees') {
      filtered.sort((a, b) => a.fees - b.fees);
    } else if (sortBy === 'experience') {
      filtered.sort((a, b) => b.years_experience - a.years_experience);
    }

    setFilteredDoctors(filtered);
  }, [allDoctors, query, selectedState, selectedCity, selectedSpecialty, feeRange, minRating, availability, sortBy]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (selectedState && selectedState !== 'all') params.set('state', selectedState);
    if (selectedCity && selectedCity !== 'all') params.set('city', selectedCity);
    if (selectedSpecialty && selectedSpecialty !== 'all') params.set('specialty_id', selectedSpecialty);
    setSearchParams(params);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedState('all');
    setSelectedCity('all');
    setSelectedSpecialty('all');
    setFeeRange([0, 2000]);
    setMinRating(0);
    setAvailability('any');
    setSortBy('rating');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Find Doctors</h1>
              <p className="text-muted-foreground">
                {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
                {query && ` for "${query}"`}
                {selectedState && selectedState !== 'all' && ` in ${selectedState}`}
                {selectedCity && selectedCity !== 'all' && `, ${selectedCity}`}
              </p>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-2xl"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Quick Search */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search doctors, specialties, or conditions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="rounded-2xl"
              />
            </div>
            <Select value={selectedState} onValueChange={(v) => { setSelectedState(v); setSelectedCity('all'); }}>
              <SelectTrigger className="w-44 rounded-2xl">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-40 rounded-2xl">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {stateScopedCities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleApplyFilters} className="rounded-2xl">
              Search
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:w-80">
              <Card className="rounded-2xl sticky top-24">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* Specialty Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Specialty</Label>
                      <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                        <SelectTrigger className="rounded-2xl">
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Specialties</SelectItem>
                          {mockSpecialties.map((specialty) => (
                            <SelectItem key={specialty.id} value={specialty.id.toString()}>
                              {specialty.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Fee Range */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Fee Range: ₹{feeRange[0]} - ₹{feeRange[1]}
                      </Label>
                      <Slider
                        value={feeRange}
                        onValueChange={setFeeRange}
                        max={2000}
                        min={0}
                        step={50}
                        className="w-full"
                      />
                    </div>

                    {/* Rating Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Minimum Rating</Label>
                      <div className="flex gap-2">
                        {[0, 3, 4, 4.5].map((rating) => (
                          <Button
                            key={rating}
                            variant={minRating === rating ? "default" : "outline"}
                            size="sm"
                            onClick={() => setMinRating(rating)}
                            className="rounded-full"
                          >
                            {rating > 0 && <Star className="h-3 w-3 mr-1" />}
                            {rating || 'Any'}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Availability */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Availability</Label>
                      <Select value={availability} onValueChange={setAvailability}>
                        <SelectTrigger className="rounded-2xl">
                          <SelectValue placeholder="Any time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any time</SelectItem>
                          <SelectItem value="today">Available Today</SelectItem>
                          <SelectItem value="tomorrow">Available Tomorrow</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort By */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Sort By</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="rounded-2xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                          <SelectItem value="fees">Lowest Fees</SelectItem>
                          <SelectItem value="experience">Most Experienced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No doctors found matching your criteria.</p>
                <Button onClick={clearFilters} className="mt-4 rounded-2xl">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}